import { ColorsModel } from '../models'
import { Msg, CreateRequest } from './types'


// Messages 

const ORIGIN = 'origin'
const TARGET = 'target'
export const CREATE_REQUEST_FROM_EXISTING_KEYS = [ 'origin_id', 'origin', 'amendments' ]
export const FIELDS = [ 'id', 'ids', 'filter', 'tags' ]
export const INSUFFICIENT_FIELDS = "Insufficient fields."
export const NO_FILTER = "Filtering is not supported."
export const NO_TAGS = "Tags are not supported."
export const NO_UNDEFINED_FIELDS : string = `At least one field is required.`
export const REQUEST_REQUIRED : string = "A request is required."
export const TAGS_FIELDS_UNDEFINED : string = "All tags fields are undefined. Did you mean to add a uri query?"
export const TAGS_REQUIRES_ITEMS = "Request including tags as an object must include a tags field and it must be an array."



// Message functions 

export const no_filter = msg( NO_FILTER )
export const no_tags = msg( NO_TAGS )
export const tags_fields_undefined = msg( TAGS_FIELDS_UNDEFINED )
export const create_request_insufficient_fields = ( model, request ) => {
  return {
    msg : INSUFFICIENT_FIELDS + ` Missing the following mutually necessary fields ${ find_missing_fields( request, CREATE_REQUEST_FROM_EXISTING_KEYS ).join(', ') } or the mutually exclusive 'content' field.`
  }
}

export const no_undefined_fields = ( model, request ) => {
  return {
    msg : NO_UNDEFINED_FIELDS + ' The following fields may be used: ' + find_missing_fields( request, FIELDS ).join( ' ,' )
  }
}

export const link_request_insufficient_fields = ( is_origin ) => `${INSUFFICIENT_FIELDS} ${ is_origin ? ORIGIN : TARGET } is not completely specified.`


// Other functions 

export function msg( msg_ : string ) : Function
{
  // Takes these arguements since such arguements will be passed down by the decorators.
  return function( model : ColorsModel, args : any ) : Msg
  {
    return { msg : msg_ }
  }
}


function find_missing_fields( request : CreateRequest, FIELDS : string[] )
{
  const fields = Object.keys( request )
  return FIELDS
    .filter(
      ( field ) => !fields.includes( field )
    )
    .map(
      ( field ) => `'${field}'`
    )
}
