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
}


export function addDefaults( collection : string ) 
{
  return fetch(
    `${process.env.API_URI}/create_defaults`,
    {
      method : 'PATCH',
      body : JSON.stringify({
        collection : collection
      }),
      headers : {
        'Content-type' : 'application/json'
      }
    }
  )
    .then( result => !collection ? result.json() : undefined )

}


export function createMakeRequest( collection : string, operation : CRUDEnum, headers : object, handle_err = ( err ) => { throw err } ) 
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
      .catch( async ( err ) => { 
        
        
      } )
  }

  return ( data : APIRequest ) => { 
    const args = {
      method : _method,
      headers : _headers,
      body : JSON.stringify( data )
    }
    console.log( args )
  
    return fetch( _uri, args )
      .then( handle_result )
      .catch( async ( err ) => { 
        err = await err
        return handle_err( Error( `API returned with status ${ err.status_code }. err = ${ JSON.stringify( err ) }.` ) ) } )
  }
}


export function createCRUD( collection : string, handle_err )
{
  return {
    _create : createMakeRequest( collection, 'create', {}, handle_err ),
    _read : createMakeRequest( collection, 'read', {}, handle_err ),
    _update : createMakeRequest( collection, 'update', {}, handle_err ),
    _delete : createMakeRequest( collection, 'delete', {}, handle_err )
  }
}

