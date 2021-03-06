import request from 'supertest'

import { create_dummy_from_integer, cleanUp, TAGS } from '../base'

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
    const IDS : any = [] 
    var the_id ;
    var the_new_id ;


    Array.from( Array( N_TESTS ).keys() ).map( index => it( "Test posting.", async () => {

      const content = create_dummy_from_integer( index ) 
      const result = await request( app )
        .post( '/tests/create' )
        .set( 'Accept', /json/ )
        .set( 'Content-type', 'application/json' )
        .send(
          { content : content }
        )
        .then( result => {
          IDS.push( result.body._id ) 
          return result
        })

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

   
    it( "Posting to create route using the alternative parameters.", async () => {
      // Copy from 'tests' ( specfified in uri ) to 'more_tests' ( specified in request ).
      
      the_id = IDS[0]
      const new_colors = { yellow : '#ffff00' }
      const amendments = {
        '$set' : {
          colors : new_colors
        }
      }
      const result = await request( app )
        .post( '/tests/create' )
        .set( 'Accept', /json/ )
        .set( 'Content-type', 'application/json' )
        .send({
          origin : 'tests',
          amendments : amendments,
          origin_id : the_id.toString()
        })

      the_new_id = result.body._id
      expect( result.statusCode ).toBe( 200 )
      expect( result.body ).toEqual(
        expect.objectContaining({
          colors : new_colors
        })
      )
      expect( result.body?.metadata?.varients?.length ).toEqual( 1 )
      expect( result.body?.metadata?.varients )
        .toEqual([ 
          expect.objectContaining({
            origin_id : the_id,
            origin : 'tests' 
          })
        ])
        
    })


    it( "Testing a parameterized GET with the id parameter.", async () => {
      
      const result = await request( app )
        .get( `/tests/read?id=${IDS[0]}` )
        .set( 'Accept', /json/ )
        .set( 'Content-type', 'application/json' )
        .send()

      expect( result.statusCode ).toBe( 200 )
      expect( result.body.length ).toBe( 1 )
      expect( result?.body[ 0 ]?._id ).toBe( IDS[ 0 ] )

    })

   
    it( "Testing a parameterized GET with the ids parameter.", async () => {

      const M = 3
      expect( M ).toBeLessThanOrEqual( N_TESTS )

      const result = await request( app )
        .get( `/tests/read?ids=${ IDS.slice( 0, M ).join( ',' ) }` )
        .set( 'Accept', /json/ )
        .set( 'Content-type', 'application/json' )
        .send()

      expect( result.statusCode ).toBe( 200 )
      expect( result.body.length ).toBe( M )
      expect( 
        result.body.map(
          item => item._id
        )
      ).toEqual( 
        expect.arrayContaining(
          IDS.slice( 0, M )
        )
      )

    })
    

    it( "Testing a parameterized GET with the tags parameter.", async () => {

      const M = 3
      expect( M ).toBeLessThanOrEqual( TAGS.length )

      const result = await request( app )
        .get( `/tests/read?tags=${ TAGS.slice( 0, M ).join( ',' ) }?containment=true` )
        .set( 'Accept', /json/ )
        .set( 'Content-type', 'application/json' )
        .send()

      expect( result.statusCode ).toBe( 200 )
      expect( result.body.length )

    })

    it( "Reading using a json post request.", async () => {
      
      const result = await request( app )
        .post( '/tests/read' )
        .set( 'Accept', /json/ )
        .set( 'Content-type', 'application/json' )
        .send({ id : the_id })

      expect( result.body.length ).toBe( 1 )
      console.log( result.body[ 0 ] )
      expect( result.statusCode ).toBe( 200 )
      expect( result?.body[ 0 ]?.metadata.varients ).toEqual([
        expect.objectContaining({
          origin_id : the_new_id,
          origin : 'tests'
        })
      ])
    
    })
    

    it( "Reading with an empty request is bad.", async () => {
    
      const result = await request( app )
        .post( '/tests/read' )
        .set( 'Accept', /json/ )
        .set( 'Content-Type', 'application/json' )
        .send({})

      console.log( result.body )
      expect( result.statusCode ).toBe( 400 )

    })

    
    it( "Updating an entry...", async () => {

      const result = await request( app )
        .put( '/tests/update' )
        .set( 'Accept', /json/ )
        .set( 'Content-Type', 'application/json' )
        .send({
          id : IDS[ 0 ],
          updates : {
            'metadata.name' : 'UPDATED'
          }
        })
      
      console.log( JSON.stringify( result.body, null, 1 ) )
      expect( result.statusCode ).toBe( 200 )
      expect( result.body.length ).toBe( 1 )
      expect( result?.body[ 0 ]?.metadata.name ).toBe( 'UPDATED' )

    })
    

    it( "Deleting the above data in 'more_tests'.", async () => {

      const result = await request( app )
        .delete( '/tests/delete' )
        .set( 'Accept', /json/ )
        .set( 'Content-type', 'application/json' )
        .send({ id : the_id })

      expect( result.statusCode ).toBe( 200 )

    })
  }
)
