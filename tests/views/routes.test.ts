import request from 'supertest'

import { create_dummy_from_integer, cleanUp } from '../base'

// import { URI_CREATE/*, URI_READ, URI_UPDATE, URI_DELETE */} from '../../src/views'
import { default as create_app } from '../../src/app'


var app ;
beforeAll( async () => {

  const everything = await create_app() 
  app = everything.app

})
afterAll( cleanUp )



describe(
  "Testing some endpoints.",
  function(){
    
    const N_TESTS = 3

    Array.from( Array( N_TESTS ).keys() ).map( index => it( "Test posting.", async () => {
      const content = create_dummy_from_integer( index ) 
      const result = await request( app )
        .post( '/tests/create' )
        .set( 'Accept', /json/ )
        .set( 'Content-type', 'application/json' )
        .send(
          { content : content }
        )

      expect( result.type ).toEqual( 'application/json' )
      expect( result.statusCode ).toBe( 200 )
      expect( result.body ).toEqual(
        expect.objectContaining( 
          { 
            metadata : expect.objectContaining( content.metadata )
          }
        )
      )

    }))


  }
)
