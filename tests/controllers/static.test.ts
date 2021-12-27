import { static_methods } from '../../src/models/'
import { parse_tags, get_pallete, READERS_NO_UNDEFINED_FIELDS, TAGS_CONTAINMENT_VALUE, TAGS_REQUIRES_ITEMS  } from '../../src/controllers/static'
import { Request } from '../../src/controllers/types'
import { cleanUp, tests, setUp } from '../base'

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

      const TAGS = [ 'look', 'these', 'are', 'more', 'tests' ]
      const N_TESTS = 5
      var IDS

      const create_data = index => static_methods.creators.create_new(
          tests,
          { 
            colors : {},
            metadata : {
              name : `name${index}`,
              description : `This is the ${index}rd description`,
              tags : TAGS.slice( 0, index )
            }
          }
        )

      
      const filler = {}
      const create_pallete = () => get_pallete(
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
        const result = await create_pallete()
        expect( result.length ).toEqual( undefined )
        expect( result ).toEqual(
          expect.objectContaining({ msg : READERS_NO_UNDEFINED_FIELDS })
        )
      })


      it( "Sending a request object with a filter.", async () => {
        filler[ 'filter' ] = { 'metadata.tags' : { '$all' : TAGS.slice( 0, 3 ) } }
        const result = await create_pallete()
        expect( result.length ).toEqual( N_TESTS - 3 )
      })


      it( "Sending a request object with tags an object.", async () => {
        // necessary to specify containment type for stability
        filler[ 'tags' ] = {
          items : TAGS,
          containment : true
        }
        const result = await create_pallete()
        expect( result.length ).toEqual( 2 )
      })


      it( "Sending a request object with ids. Testing precidence.", async () => {
        filler[ 'ids' ] = IDS 
        const result = await create_pallete()
        expect( result.length ).toEqual( N_TESTS )
        expect( result ).toEqual(
          expect.arrayContaining(
            IDS.map( _id => expect.objectContaining({ _id : _id }) )
          ) 
        )
      })


      it( "Sending a request object with id.", async () => {
        filler[ 'id' ] = IDS[0]
        const results = await create_pallete()
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
