import { accessor_with_validator } from './decorators'
import { Varients, MetadataSafe, ColorsSafe } from '../models'
import { getPallete } from './static'
import { Fetcher } from './types'
import { validate_colors, validate_description, validate_name, validate_tags, validate_varients } from '../models/validate'


// Classes for client side validation.
export class MetadataState implements MetadataSafe
{


  private _description
  private _name
  private _tags
  private _varients


  constructor( readonly id : string, _description : string, _name : string, _tags : string[], _varients : Varients )
  {
    // Must be assigned this way, and not by declaring visibilty in arguements to get validation.
    this.description = _description
    this.name = _name
    this.tags = _tags
    this.varients = _varients
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

  constructor( readonly id : string, public _colors : object, public _metadata : MetadataState )
  {
  }


  get colors(){ return this._colors }

  @accessor_with_validator( validate_colors )
  set colors( new_colors : object )
  { 
    this._colors = new_colors 
  }


  get metadata(){ return this._metadata }

  set metadata( validate_metadata : MetadataState )
  {
    this._metadata = validate_metadata
  }


}


export class PalleteFetcher implements Fetcher
{

  readonly create
  readonly read
  readonly update
  readonly destroy

  private state

  constructor( readonly collection : string, readonly id : string )
  {
    this.state = this.refreshState()
    console.log( this.state )
  }

  async refreshState()
  {
    const pallete : any = await getPallete( this.collection, this.id )
    return new State( pallete.id, pallete.colors, pallete.metadata )
  }

}
