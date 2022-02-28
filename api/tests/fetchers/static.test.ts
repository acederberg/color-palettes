import { create_dummy_from_integer } from '../base'

import { createCRUD, createMakeRequest, HEADERS } from '../../src/fetchers/static'
import { CreateRequest, Request } from '../../src/controllers/types'
  

const TESTS : string = 'tests'
const HANDLE_ERROR = ( err ) => { throw Error( JSON.stringify( err ) ) } 


describe(
  "Testing function factories.",
  function(){
    
    let IDS : any[] = [] ;
    let request_read : Request ;
    const { _create, _read, _update, _delete } = createCRUD( TESTS, HANDLE_ERROR )


    it( "Testing the 'createMakeRequest' method.", async () => {
      const create = createMakeRequest( TESTS, 'create', HEADERS, HANDLE_ERROR )
      const request_content = create_dummy_from_integer(0) 
      const request : CreateRequest = { content : request_content }

      const result = await create( request )
      expect( result ).toEqual(
        expect.objectContaining({ 
          metadata : expect.objectContaining( request_content.metadata )
        })
      )

      IDS.push( result._id )
    })


    it( "Testing the 'createCRUD' '_create' method.", async () => {
      const request_content = create_dummy_from_integer( 1 )
      const request_create = { content : request_content }

      const result = await _create( request_create )
      expect( result.metadata ).toEqual( 
        expect.objectContaining( request_content.metadata )
      )

      IDS.push( result._id )
    })


    it( "Testing the 'createCRUD' '_read' method.", async () => {
      request_read = { ids : IDS }
      const result = await _read( request_read )
      expect( result.map( result => result._id ) )
        .toEqual(
          expect.arrayContaining( IDS )
        )
    })


    it( "Testing the 'createCRUD' '_update' method.", async () => {
      const request_update : Request = { 
        id : IDS[0],
        updates : {
          colors : {
            blue : '#338aff',
            red : '#ff5555'
          }
        }
      }
      const result = await _update( request_update )
      expect( result.length ).toBe( 1 )
    })


    it( "Testing the 'createCRUD' '_delete' method.", async () => {
      const result = await _delete( request_read )
      expect( result.map( result => result._id ) )
        .toEqual(
          expect.arrayContaining( IDS )
        )
    })

  }
)
