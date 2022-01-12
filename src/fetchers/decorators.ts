import 'reflect-metadata'


export const FORMAT_PROPERTY_VALIDATION_ERROR_MSG = ( property_name : string, property_value : string, msg : string ) => `Validation error for ${ property_name }=${ property_value }: ${ msg }`


export function accessor_with_validator( validator : Function )
{
  // Accessor decorator facorory to apply validation.
  return function validate<T>( target : any, method_key : string, method_descriptor : PropertyDescriptor )
  {
    
    // Get method, overide with method + validation.
    let method : Function = method_descriptor.set!

    method_descriptor.set = function( args : T ){
      const is_valid = validator( args ) 
      if ( is_valid === true ) return method.call( this, args )
      else
      {
        throw Error( 
          FORMAT_PROPERTY_VALIDATION_ERROR_MSG(
            method_key,
            is_valid,
            is_valid.msg
          )
        )
      }
    }

  }
}


