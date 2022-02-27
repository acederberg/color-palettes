import data from './defaults.json'
import { create_model_for_user } from './models'
import { create_new } from './static'
import { ColorsSafe } from './types'


const DEFAULTS_COLLECTION_NAME : string = "defaults"


export default async function main( collection_name : string | undefined = undefined )
{

  const defaults = create_model_for_user( collection_name || DEFAULTS_COLLECTION_NAME )
  
  for ( const item of data )
  {
      const found = await defaults.findById( item._id ).exec()
        .then( ( result ) => {
          console.log( '='.repeat( 100 ) )
          console.log( 'found = ', JSON.stringify( result, null ) )
          return result
        })

      if ( !found ) await create_new( 
          defaults, 
          item as ColorsSafe,
          item._id
        )
  }

}
