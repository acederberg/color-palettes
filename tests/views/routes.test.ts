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
    
    Array.from( Array( 1 ).keys() ).map( index => it( "Test posting.", async () => {
      const content = create_dummy_from_integer( index ) 
      const result = await request( app )
        .post( '/tests/create' )
        .set( 'Accept', /json/ )
        .set( 'Content-type', 'application/json' )
        .send(
          { content : content }
        )
      console.log( result.body )
      expect( result.statusCode ).toBe( 200 )
    }))


  }
)
