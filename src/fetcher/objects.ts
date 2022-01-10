import { Varients, MetadataSafe, ColorsSafe } from '../models'
import { getPallete } from './static'
import { Data } from './types'

// Classes
export class MetadataState implements MetadataSafe
{

  constructor( readonly id : string, public description : string, public name : string, public tags : string[], public varients : Varients )
  {
  }

}


export class ColorsState implements ColorsSafe
{

  constructor( readonly id : string, public colors : object, public metadata : object )
  {
  }

}


export class PalleteFetcher implements Data
{

  //
  readonly create
  readonly read
  readonly update
  readonly destroy

  private state

  constructor( readonly collection : string, readonly id : string )
  {
    this.state = this.getState()
    console.log( this.state )
  }

  async getState()
  {
    const pallete = await getPallete( this.collection, this.id )
    return new ColorsState( pallete.id, pallete.colors, pallete.metadata )
  }

}
