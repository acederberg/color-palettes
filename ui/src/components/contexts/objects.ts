import { with_global_state_invokation } from './decorators'


const INVOKE_GLOBAL_STATE_UPDATE_UNSET = "To change the global state, `GlobalState.invokeGlobalStateUpdate` must be set."


export class GlobalState
{
  // Determines the rendering of 'App'.
  // Updated by the consumers of the GlobalContext ( likely using hooks ).
  // Updates to `collectionName` and `palleteId` should result in `invokeGlobalStateUpdate` being called.

  public mode : Modes
  public collectionName : string
  public palleteId : string

  readonly invokeGlobalStateUpdate : Function


  constructor( initial_mode : Modes | null = 'collection', invokeGlobalStateChange : Function = ( ...args ) => alert( INVOKE_GLOBAL_STATE_UPDATE_UNSET ) )
  {
    this.mode = 'collections' || initial_mode
  }


  @with_global_state_update
  set collectionName( new_collection_name : string ){ this.collectionName = new_collection_name }


  @with_global_state_update
  set palleteId( new_pallete_id : string ){ this.collectionName

}
