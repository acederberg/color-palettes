import supertest from 'supertest'
import { Express } from 'express'

import { ColorsModel } from '../../src/models'
import { with_route } from '../../src/views'
import { Request } from '../../src/controllers'
import create_app from '../../src/server'

var APP : Express 
var REQUEST 

beforeAll( async () => {

  APP = await create_app()
  REQUEST = await supertest( APP )

})


describe(
  "Test the with route decorator by making a function.",
  function()
  {
    const MSG : String = 'This is a test.'
    const TEST_METHOD : Function = ( model : ColorsModel, request : Request ) => {
      return {
        msg : MSG
      }
    }
    const TEST_ROUTE : string = '/test'
   

    it( `Decorate 'TEST_METHOD' with 'with_route'. Routes to TEST_ROUTE=${TEST_ROUTE}.`, () => {
      
      expect(
        () => with_route( APP, 'get', TEST_ROUTE, TEST_METHOD, true )
      ).not.toThrowError()

    })


    it( "", async () => {

      const result = await REQUEST.get( TEST_ROUTE ).send()
      console.log( result.body )
      expect( result.statusCode ).toEqual( 200 )

    })


  }
)
