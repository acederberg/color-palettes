import { static_methods } from '../../src/models/'
import { parse_tags, read_palletes, update_palletes, delete_palletes, NO_UNDEFINED_FIELDS, TAGS_CONTAINMENT_VALUE, TAGS_REQUIRES_ITEMS  } from '../../src/controllers/static'
import { Request } from '../../src/controllers/types'
import { cleanUp, create_data, tests, setUp, TAGS } from '../base'

beforeAll( setUp )
afterAll( cleanUp )


describe(
  "Test the request parser.",
  function(){

    const tags = [ 'this', 'is', 'a', 'test' ]
    const admissible_keys = []
 
    const tags_keys_okay = ( parsed ) => expect( 
      Object .keys( parsed )
    )
      .toEqual( expect.arrayContaining( admissible_keys ) )

    const tags_parsed_okay = ( parsed, tags_containment_value ) => expect( parsed.tags ).toEqual(
      expect.objectContaining({
        items : expect.arrayContaining( tags ),
        containment : tags_containment_value
      })
    )


    it( "Test parse_tags with array data.", () => {
      
      const request : Request = { collection : 'tests',  tags : tags }
      const parsed_request : any = parse_tags( request )

      tags_keys_okay( parsed_request )
      tags_parsed_okay( parsed_request, TAGS_CONTAINMENT_VALUE )

    })


    it( "Test parse_tags with incomplete object data.", () => {
      
      const request = { 
        collection : 'tests', 
        tags : {
          items : tags 
        }
      }
      const parsed_request : any = parse_tags( request )

      tags_keys_okay( parsed_request )
      tags_parsed_okay( parsed_request, TAGS_CONTAINMENT_VALUE )

    })


    it( "Test parse_tags with insufficient data.", () => {
      const request = { 
        collection : 'tests', 
        tags : {
        }
      }
      expect( 
        () => parse_tags( request )
      )
          .toThrow( TAGS_REQUIRES_ITEMS ) 

    })

  }
)


describe(
  "Testing the with_decide decorator via its application to static read methods from 'model' ",
  function(){

    var IDS
    const N_TESTS = 5

    var filler = {}
    const send_request = () => read_palletes(
        tests,
        { 
          ...filler,
          collection : 'tests',
        }
      )


    Array.from( Array( N_TESTS ).keys() ).map( 
      index => it( "Creating some test data.", async () => {
          const result = await create_data( index )
          expect( result ).toEqual(
            expect.objectContaining(
              { 
                metadata : expect.objectContaining({ tags : TAGS.slice( 0, index ) })
              }
            )
          )
      })
    )

    
    it( "Get a list of ids that were posted.", async () => {
      const results = await tests.find({}).exec()
      IDS = results.map( result => result._id )
      expect( IDS.length ).toBe( N_TESTS )
    })


    it( "Sending a request object no fields.", async () => {
      const result = await send_request()
      expect( result.length ).toEqual( undefined )
      expect( result ).toEqual(
        expect.objectContaining({ msg : NO_UNDEFINED_FIELDS })
      )
    })


    it( "Sending a request object with a filter.", async () => {
      filler[ 'filter' ] = { 'metadata.tags' : { '$all' : TAGS.slice( 0, 3 ) } }
      const result = await send_request()
      expect( result.length ).toEqual( N_TESTS - 3 )
    })


    it( "Sending a request object with tags an object.", async () => {
      // necessary to specify containment type for stability
      filler[ 'tags' ] = {
        items : TAGS,
        containment : true
      }
      const result = await send_request()
      expect( result.length ).toEqual( 2 )
    })


    it( "Sending a request object with ids. Testing precidence.", async () => {
      filler[ 'ids' ] = IDS 
      const result = await send_request()
      expect( result.length ).toEqual( N_TESTS )
      expect( result ).toEqual(
        expect.arrayContaining(
          IDS.map( _id => expect.objectContaining({ _id : _id }) )
        ) 
      )
    })


    it( "Sending a request object with id.", async () => {
      filler[ 'id' ] = IDS[0]
      const results = await send_request()
      expect( results.length ).toEqual( 1 )
      expect( results ).toEqual( 
        expect.arrayContaining([
          expect.objectContaining(
            { _id : IDS[ 0 ] }
          )
        ])
      )
    })

  }
)


describe(
  "Testing the 'update_palletes' function.",
  function(){

      var ID ;
      const NEW_TAGS = [ 'many', 'new', 'tags' ]
      const filler = {}
      const send_update_request = ( update_with ) => update_palletes(
        tests,
        {
          ...filler,
          collection : 'tests',
        },
        update_with,
      )

      it( "Post some data.", async () => {
        const inputs = {
          colors : {},
          metadata : {
            name : `somename`,
            description : `This is the description`,
            tags : TAGS
          }
        }
        const result = await static_methods.creators.create_new(
            tests,
            inputs
        )
        ID = result[ '_id' ]
        expect( result ).toMatchObject( inputs )

      })


      it( "Update by id.", async () => {
        filler[ 'id' ] = ID
        console.log( filler )
        const results = await send_update_request({ 'metadata.tags' : NEW_TAGS })
        expect( results ).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ 
              metadata : expect.objectContaining({
                tags : NEW_TAGS 
              })
            })
          ])
        )
      })


    const send_delete_request = () => delete_palletes( tests, {
      ...filler,
      collection : 'tests'
    })


    it( "Delete by id.", async () => {
      const results = await send_delete_request()
      console.log( results )
      expect( results.length ).toEqual( 1 )
    })


  }
)
