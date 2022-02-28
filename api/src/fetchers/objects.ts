import { accessor_with_validator } from './decorators'
import { Varients, MetadataSafe, ColorsSafe } from '../models'
import { addDefaults, createCRUD/*, getPallete*/ } from './static'
import { Fetcher } from './types'
import { validate_colors, validate_description, validate_name, validate_tags, validate_varients } from '../models/validate'


export const INVALID_STATE = "Invalid state."
export const METHOD_IS_NOT_DEFINED = () => { msg : "Method is not defined :(" }


// IMPLEMENTATIONS OF SCHEMAS ---------------------------------------------------------------------------------------------------------- //
// Classes for client side validation.


export class MetadataState implements MetadataSafe
{

  readonly id
  private _description
  private _name
  private _tags
  private _varients


  constructor( id : string, _description : string, _name : string, _tags : string[], _varients : Varients )
  {
    // Must be assigned this way, and not by declaring visibilty in arguements to get validation.
    this.id = id
    this.description = _description
    this.name = _name
    this.tags = _tags
    this.varients = _varients
  }
  

  static fromRaw( raw : any )
  {
    if ( !raw ) return { 'msg' : INVALID_STATE }
    return new MetadataState(
      raw._id,
      raw.description,
      raw.name,
      raw.tags,
      raw.varients
    )
  }


  dump() : MetadataSafe & { _id : string }
  {
    return {
      _id : this.id,
      description : this.description,
      name : this.name,
      tags : this.tags,
      varients : this.varients
    }
  }

 
  // Description

  get description()
  {
    return this._description
  }

  @accessor_with_validator( validate_description )
  set description( new_description : string )
  { 
    this._description = new_description 
  }


  // Name

  get name()
  { 
    return this._name
  }

  @accessor_with_validator( validate_name )
  set name( new_name : string )
  {
    this._name = new_name
  }


  // Tags
  
  get tags()
  {
    return this._tags
  }

  @accessor_with_validator( validate_tags )
  set tags( new_tags : string[] )
  {
    this._tags = new_tags
  }


  // Varients

  get varients()
  {
    return this._varients
  }

  @accessor_with_validator( validate_varients )
  set varients( new_varients : Varients )
  {
    this._varients = new_varients
  }

}


export class State implements ColorsSafe
{

  private _colors 


  constructor( readonly id : string, _colors : object, public _metadata : MetadataState )
  {
    this.colors = _colors ? _colors : {}
  }
  
  static fromRaw( raw : any )
  { 
    console.log( raw )
    if ( !raw || !raw.metadata ) return { 'msg' : INVALID_STATE }
    return new State(
      raw._id,
      raw.colors,
      <MetadataState>MetadataState.fromRaw( raw.metadata )
    )
  }

  get colors(){ return this._colors }

  @accessor_with_validator( validate_colors )
  set colors( new_colors : object )
  { 
    this._colors = new_colors 
  }


  get metadata(){ return this._metadata }

  set metadata( new_metadata : MetadataSafe )
  {
    this._metadata = new MetadataState( 
      '',
      new_metadata.description || '',  
      new_metadata.name || '',
      new_metadata.tags || [], 
      new_metadata.varients || []
    )
  }


  dump()
  {
    return {
      colors : this.colors,
      metadata : this._metadata.dump()
    }
  }

}


// Fetching plus validation.

export class CRUD implements Fetcher
{
  // So that I don't have to repeat this. Not really for direct instantiation.
  // This will be useful when I implement authentication.

  readonly _create
  readonly _read
  readonly _update
  readonly _delete

  constructor( readonly collection, public handle_err )
  {
    
    const { _create, _read, _update, _delete } = createCRUD( this.collection, handle_err )
    this._create = _create
    this._read = _read
    this._update = _update
    this._delete = _delete

  }

  create( ...args ){ return METHOD_IS_NOT_DEFINED() }
  read( ...args ){ return METHOD_IS_NOT_DEFINED() }
  update( ...args ){ return METHOD_IS_NOT_DEFINED() }
  delete( ...args ){ return METHOD_IS_NOT_DEFINED() }

}


export class PalleteFetcher extends CRUD
{
  // For the modification of palletes.
  // State is to be modified by the ui.

  readonly initialId
  public state


  constructor( readonly collection : string, initialId : string | null, handle_err )
  {
    super( collection, handle_err )
    this.initialId = initialId
  }

  
  async create( raw : any ) 
  {
    // Asynchronous to match the other methods.
    // Create in collection new from internals
    let result 
    if ( this.state ) 
    {
      result = await this._create({
        "content" : { ...( raw || this.state.dump() ) } 
      })
        .then( 
          // When 200 status should not have a `Msg`
          result => State.fromRaw( result ) 
        )
        .catch( err => {
          this.handle_err( err ) 
        })
      this.state = result
      console.log( result )
    }
    return result
  }
  

  async read()
  {
    // Read state from api, return it
    const result = await this._read({ id : this.state ? this.state.id : this.initialId })
      .catch( this.handle_err )
      .then( result => { console.log( result ); return result[ 0 ] } )
    // If not a resume, notify client
    if ( !result ) return Object()
    // Cast to 'State'
    const fromRaw = State.fromRaw( result )
    this.state = fromRaw 
    return fromRaw
  }

 
  async update()
  {
    // update from internals.
    // Fetch new state and return it if it is okay.
    const dumped = this.state.dump()
    const result = await this._update({
      id : this.state.id,
      update : {
        '$set' : dumped 
      }
    })
      .catch( this.handle_err )
    return result
  }


  async delete()
  {
    // Destory the value and return dumped state.
    // If something goes wrong, the api will tell you
    console.log( this.state.id )

    if ( !this.state ) return 

    const dumped = this.state.dump()
    const result = await this._delete({
      id : this.state.id
    })
      .catch( this.handle_err )
    this.state = null ;
    console.log( result )
    return dumped
  }


  show()
  {
    console.log( JSON.stringify( this.state ) )
  }

}


export class CollectionFetcher extends CRUD
{
  // Client for entire collections.
  // No internal state.
  constructor( collection : string, handle_err )
  {
    super( collection, handle_err )  
  }

  create( template : ColorsSafe | undefined = undefined )
  {
    // Template required since a new collection will only 'stick' if there is an item in the collection
    // It is as simple as posting to the collection.
    return template ? this._create({ 
      content : template
    }) : addDefaults( this.collection )
      .catch( this.handle_err )
  }

  read( request : Request )
  {
    return this._read({ 
      all : process.env.API_ALL_KEY, 
      ...request 
    })
      .catch( this.handle_err )
  }

  update( request : Request )
  {
    return this._update({ 
      all : process.env.API_ALL_KEY, 
      ...request 
    })
      .catch( this.handle_err )
  }

  delete( request : Request )
  {
    return this._delete({ 
      all : process.env.API_ALL_KEY, 
      ...request 
    })
      .catch( this.handle_err )
  }

}


