import { CREATE_VARIENTS_MODIFIER, PULL, find_varients } from './static'
import { ColorsModel } from './types'


// For the get methods.
export function with_exec( method : Function ) : Function
{
  return function ( model : ColorsModel, ...args ) : Object
  {
    return method( model, ...args ).exec()
  }
}


// Update methods will have similar decorators but will additionally update the 'modified' field every time.
// Also, certian fields must not be  updatable, e.g. 'created' and 'modified'
export function with_update( method : Function ) : Function
{
  return function ( model : ColorsModel, content : Object, ...args ) : Object
  {
    // Should limit keys in content.
    return (
      async () => {
        const now = await Date.now()
        /*const args = {
        }*/
        await method( model, ...args )
          .update(
            {
              ...content,
              '$push' : {
                'metadata.modified' : now
              }
            }
          )
          .exec()
        const result = await method( model, ...args ).exec()
        return result
      }
    )()
  }
}


export function with_delete( method : Function ) : Function
{
  return function ( model : ColorsModel, ...args ) : Object
  {
    // Find the documents in the collection corresponding to `model`, save them for return, and `delete` them.
    return (
      async result => {
        // Find result to return.
        let results : any = await method( model, ...args ).exec()

        // Delink from varients.
        // results might be a list or might just be an item
        if ( !( '0' in results ) ) results = [ results ]

        // Get varients for each result in results. 
        // When this varient is not defined then remove
        for ( const a_result of results )
        {
          await find_varients( 
            model, 
            a_result._id,
            _varient => _varient.update( 
              CREATE_VARIENTS_MODIFIER( 
                PULL, 
                model, 
                a_result.id 
              )
            ).exec()
          )
        }

        // Delete.
        await method( model, ...args ).remove().exec()
        return results
      }
    )()

  }
}

