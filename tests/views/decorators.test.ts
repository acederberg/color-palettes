import supertest from 'supertest'
import { Express } from 'express'

import { ColorsModel } from '../../src/models'
import { with_route/*, with_parameterized_route */} from '../../src/views'
import { Request } from '../../src/controllers'
import create_app from '../../src/server'

var APP : Express 
var REQUEST 

beforeAll( async () => {

  APP = await create_app()
  REQUEST = await supertest( APP )

})


describe(
  "Test the 'with_route' decorator.",
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


    it( "Make a request to the decorated method.", async () => {

      const result = await REQUEST.get( TEST_ROUTE ).send()
      expect( result.statusCode ).toEqual( 200 )

    })


  }
)

/*
describe(
  "Test the 'with_route' decorator.",
  function()
  {

    const MSG : String = 'This is yet another test.'
    const TEST_METHOD : Function = ( model : ColorsModel, request : Request ) => {
      return { msg : MSG }
    }
    const TEST_ROUTE = '/test_again'

    it( "Decorate 'TEST_METHOD' with 'with_parameterized_route'.", () => {
      expect(
        () => with_parameterized_route( APP, 'get', TEST_ROUTE, TEST_METHOD )
      ).not.toThrowError()
    })


    it( "Make a request to the decorated method.", async () => {
      const result = await REQUEST.get( TEST_ROUTE ).send()
      console.log( result )
      expect( result.statusCode ).toEqual( 400 )
    })


  }
)
*/
