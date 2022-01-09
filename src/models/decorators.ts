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

import { CREATE_VARIENTS_MODIFIER, PULL, find_varients } from './static'
//import { create_model_for_user } from './models'

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

        console.log( model.modelName )

        // Get varients for each result in results. 
        // When this varient is not defined then remove
        for ( const a_result of results )
        {
          const varients = await find_varients( 
            model, 
            a_result._id,
            ( _varient ) => {
              console.log( '@callback:_varient', JSON.stringify( _varient, null, 1 ) )

              // 
              const mod = CREATE_VARIENTS_MODIFIER( 
                PULL, 
                model, 
                a_result.id 
              )
              console.log( '@callback:mod', mod )
              _varient.update( mod ).exec()
            }
          )
          console.log( '@with_delete:varients', JSON.stringify( varients ) )
        }

        // Delete.
        await method( model, ...args ).remove().exec()
        return results
      }
    )()

  }
}

