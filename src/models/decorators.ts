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
        const results = await method( model, ...args ).exec()
        await method( model, ...args ).remove().exec()
        return results
      }
    )()

  }
}

