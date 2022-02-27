import { HTTPEnum, CRUDEnum, APIRequest } from './types'
import 'cross-fetch/polyfill'


export const OPERATIONS : Object = {
  create : 'POST',
  read : 'POST',
  update : 'PUT',
  delete : 'DELETE'
}
export const CREATE_URI : Function = ( collection, operation ) => `${ process.env.API_URI }/${ collection }/${ operation }`
export const HEADERS = {
  'Content-Type' : 'application/json'
}


export function getPallete( collection : string, id : string )
{
  return fetch(
    `${ CREATE_URI( collection, 'read' ) }?id=${ id }`,
    {
      method : 'GET',
      headers : HEADERS
    }
  )
    .then( result => result.json() )
    .catch( err => { throw err } )
}


export function createMakeRequest( collection : string, operation : CRUDEnum, headers : object, handle_err : Function, handle_exception = ( err ) => { throw err } ) 
{
  // Make a request with JSON data.
  // collection : Collection to which a pallete belongs.
  // operation : Some CRUD.
  // headers : additional headers
  // handle_err : error handler, e.g. an alert.

  const _headers : any = { ...HEADERS, ...headers }
  const _uri : string = CREATE_URI( collection, operation )
  const _method : HTTPEnum = OPERATIONS[ operation ]

  function handle_result( result )
  {
    if ( !result.ok ) handle_err( result.json() )
    return result.json()
      .catch( err => { throw err } )
  }

  return ( data : APIRequest ) => { 
    return fetch(
      _uri, {
        method : _method,
        headers : _headers,
        body : JSON.stringify( data )
      }
    )
      .then( handle_result )
      .catch( handle_exception )
  }
}


export function createCRUD( collection : string, handle_err : Function )
{
  return {
    _create : createMakeRequest( collection, 'create', {}, handle_err ),
    _read : createMakeRequest( collection, 'read', {}, handle_err ),
    _update : createMakeRequest( collection, 'update', {}, handle_err ),
    _delete : createMakeRequest( collection, 'delete', {}, handle_err )
  }
}

