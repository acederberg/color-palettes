import { with_validator } from './decorators'
import { Varients, MetadataSafe, ColorsSafe } from '../models'
import { getPallete } from './static'
import { Data } from './types'
import { validate_colors, validate_description, validate_name, validate_tags } from '../models/validate'


// Classes for client side validation.
export class MetadataState implements MetadataSafe
{

  constructor( readonly id : string, private _description : string, public _name : string, public _tags : string[], public _varients : Varients )
  {
  }
 
  
  // Description

  get description()
  {
    return this._description
  }

  @with_validator( validate_description )
  set description( new_description : string )
  { 
    this._description = new_description 
  }


  // Name

  get name()
  { 
    return this._name
  }

  @with_validator( validate_name )
  set name( new_name : string )
  {
    this._name = new_name
  }


  // Tags
  
  get tags()
  {
    return this._tags
  }

  @with_validator( validate_tags )
  set tags( new_tags : string[] )
  {
    this._tags = new_tags
  }


  // Varients

  get varients()
  {
    return this._varients
  }

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

  @with_validator( validate_colors )
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


export class PalleteFetcher implements Data
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
    const pallete = await getPallete( this.collection, this.id )
    return new State( pallete.id, pallete.colors, pallete.metadata )
  }

}
