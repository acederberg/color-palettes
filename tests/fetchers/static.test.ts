//import request from 'supertest'
//import { Express/*, Server*/ } from 'express'

import { create_dummy_from_integer } from '../base'

import { createMakeRequest, HEADERS } from '../../src/fetchers/static'
import { CreateRequest } from '../../src/controllers/types'
// import create_app from '../../src'
  

//let APP : Express ;
//let SERVER : Server ;
const TESTS : string = 'tests'
const HANDLE_ERROR : Function = ( err ) => { throw Error( err ) } 

/*
beforeAll( async function(){
  [ APP, SERVER ] = await create_app() 
})


afterAll( async function(){
  
  await SERVER.close( 
    () => process.stdout.write( "Killing server..." )
  )

})
*/

it( "Testing the 'createMakeRequest' method.", async () => {
/*
  const created_result = await request( APP )
    .post( `/${ TESTS }/create` )
    .set( 'Accept', /json/ )
    .set( 'Content-type', 'application/json' )
    .send({ content : create_dummy_from_integer( 0 ) })
    .expect( 200 )
*/
  const reader = createMakeRequest( TESTS, 'create', HEADERS, HANDLE_ERROR )
  const request : CreateRequest = { content : create_dummy_from_integer(0) }

  reader( request )
})
