//import { MetadataSafe, ColorsSafe } from '../models/types'
import { HTTPEnum,/* Data,*/ CRUDEnum, APIRequest } from './types'


const OPERATIONS : Object = {
  create : 'POST',
  read : 'POST',
  update : 'PUT',
  delete : 'DELETE'
}
const CREATE_URI : Function = ( collection, operation ) => `/${ collection }/${ operation }`
const HEADERS : Object = {
  'Content-Type' : 'application/json'
}


export function createMakeRequest( collection : string, operation : CRUDEnum, headers : object, handle_err : Function )
{
  // Make a request with JSON data.
  // collection : Collection to which a pallete belongs.
  // operation : Some CRUD.
  // headers : additional headers
  // handle_err : error handler, e.g. an alert.

  const _headers : any = { ...HEADERS, ...headers }
  const _uri : string = CREATE_URI( collection )
  const _method : HTTPEnum = OPERATIONS[ operation ]

  function handle_result( result )
  {
    if ( !result.ok ) handle_err( result )
    return result.json()
  }


  return ( data : APIRequest ) => fetch(
    _uri, {
      method : _method,
      headers : _headers,
      body : JSON.stringify( data )
    }
  )
    .then( handle_result )
}


export function createCRUD( collection : string, handle_err : Function )
{
  return {
    _create : createMakeRequest( collection, 'create', {}, handle_err ),
    _read : createMakeRequest( collection, 'read', {}, handle_err ),
    _update : createMakeRequest( collection, 'update', {}, handle_err ),
    _delete : createMakeRequest( collection, 'destroy', {}, handle_err )
  }
}
