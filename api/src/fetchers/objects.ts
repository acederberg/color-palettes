import { accessor_with_validator } from './decorators'
import { Varients, MetadataSafe, ColorsSafe } from '../models'
import { createCRUD/*, getPallete*/ } from './static'
import { Fetcher } from './types'
import { validate_colors, validate_description, validate_name, validate_tags, validate_varients } from '../models/validate'


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
    this.colors = _colors
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

  create(){ return METHOD_IS_NOT_DEFINED() }
  read(){ return METHOD_IS_NOT_DEFINED() }
  update(){ return METHOD_IS_NOT_DEFINED() }
  delete(){ return METHOD_IS_NOT_DEFINED() }

}


export class PalleteFetcher extends CRUD
{
  // For the modification of palletes.
  // State is to be modified by the ui.

  private initialId
  private state


  constructor( readonly collection : string, readonly id : string, handle_err )
  {
    super( collection, handle_err )
    this.initialId = id
//  this.state = this.refreshState()
  }

/*
  async refreshState()
  {
    const pallete : any = await getPallete( this.collection, this.id )
    return new State( pallete.id, pallete.colors, pallete.metadata )
  }
*/
  
  create() 
  {
    // Create in collection new from internals
    return this._create( this.state.dump() )
  }
  

  read()
  {
    return this._read({ id : this.state ? this.state.id : this.initialId })
  }

 
  update()
  {
    // update from internals
    return this._update({
      id : this.state.id,
      update : {
        '$set' : this.state.dump()
      }
    })
  }


  delete()
  {
    return this._delete({
      id : this.state.id
    })
  }


  show()
  {
    console.log( JSON.stringify( this.state ) )
  }

}


export class CollectionFetcher extends CRUD
{

  constructor( collection : string, handle_err : Function )
  {
    super( collection, handle_err )  
  }


  create()
  {
    return this._create({ all : process.env.API_ALL_KEY })
  }


  read()
  {
    return this._read({ all : process.env.API_ALL_KEY })
  }


  delete()
  {
    return this._delete({ all : process.env.API_ALL_KEY })
  }

}
