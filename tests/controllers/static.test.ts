import { parse_tags, TAGS_CONTAINMENT_VALUE  } from '../../src/controllers/static'
import { Request } from '../../src/controllers/types'

describe(
  "Test the request parser.",
  function(){

    const tags = [ 'this', 'is', 'a', 'test' ]
    const admissible_keys = []
 
    const tags_keys_okay = ( keys ) => expect( keys ).toEqual(
      expect.arrayContaining( admissible_keys )
    )
    const tags_parsed_okay = ( parsed, tags_containment_value ) => expect( parsed.tags ).toEqual(
      expect.objectContaining({
        items : expect.arrayContaining( tags ),
        containment : tags_containment_value
      })
    )


    it( "Test parse_tags with array data.", () => {
      const request : Request = { collection : 'tests',  tags : tags }
      const parsed_request : any = parse_tags( request )
      const keys = Object.keys( parsed_request.tags )

      tags_keys_okay( keys )
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

      tags_keys_okay( Object.keys( parsed_request ) )
    })



  }
)
