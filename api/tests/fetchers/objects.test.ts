import { MetadataState, State } from '../../src/fetchers'
import { /*ColorsSafe, MetadataSafe, */PARAMS } from '../../src/models'


// Constants used throughout the tests

const test_colors = {
  red : '#ff5555',
  blue : '#338aff',
  green : '#8aff55'
}

const test_name = 'a'.repeat( PARAMS.name.max_length - 1 )
const test_description = 'a'.repeat( PARAMS.description.max_length - 1)
const test_tags = Array( Array( PARAMS.tags.max_tags ) ).map( 
  value => 'a'.repeat( PARAMS.tags.max_length - 1 )
)

const bad_colors = {
  red : '#f000',
  yellow : 'arejgbnqe2-39<F2>75yc',
  purple : '#8a55fff'
}

const bad_name = 'a'.repeat( PARAMS.name.max_length + 1 ) 
const bad_description = 'a'.repeat( PARAMS.description.max_length + 1 ) 
const bad_tags =
  Array( Array( PARAMS.tags.max_tags ) ).map( 
  value => 'a'.repeat( PARAMS.tags.max_length + 1 )
)


// Class instances used between tests.

let M : MetadataState ;
let S : State ; 



describe( 
  "Testing the 'metadataState' object",
  function()
  {

    it( "Assigning M with legal constructor values.", () => {
      expect( 
        () => { M = new MetadataState(
          '0',
          test_description,
          test_name,
          test_tags,
          []
        )}
      ).not.toThrowError()

      expect( M.name ).toEqual( test_name )
      expect( M.description ).toEqual( test_description )
      expect( M.tags ).toEqual( test_tags )
    })


    it( "Attempting to call constructor with bad values.", () => {
  
      expect(
        () => new MetadataState(
          '1',
          bad_description,
          bad_name,
          bad_tags,
          []
        )
      ).toThrowError()


      expect(
        () => new MetadataState(
          '2',
          test_description,
          bad_name,
          test_tags,
          []
        )
      ).toThrowError()

  
      expect(
        () => new MetadataState(
          '3',
          test_description, 
          test_name,
          bad_tags,
          []
        )
      ).toThrowError()

    })


    it( "Testing validation for the description property.", () => {
      
      expect( 
        () => { M.description = bad_description }
      ).toThrowError()

      expect(
        () => { M.description = test_description }
      ).not.toThrowError()
  
    })
     
  
    it( "Testing validation for the name property.", () => {
      
      expect(
        () => { M.name = bad_name }
      ).toThrowError()

      expect(
        () => { M.name = test_name }
      ).not.toThrowError()

    })


    it( "Testing validation for the tags property.", () => {
      
      expect(
        () => { M.tags = bad_tags }
      ).toThrowError()

      expect(
        () => { M.tags = test_tags }
      ).not.toThrowError()

    })
  

  }
)


describe(
  "Testing the 'State' object.",
  function()
  {

    it( "Instantiate with good parameters", () => {

      expect(       
        () => { S = new State( '4', test_colors, M ) }
      ).not.toThrowError()

      console.log( JSON.stringify( S ) )

    }) 


    it( "Instantiate with bad parameters", () => {

      expect(
        () => { new State( '5', bad_colors, M ) }
      ).toThrowError()

    })


    it( "Assign bad colors to existing", () => {
      
      expect(
        () => { S.colors = bad_colors }
      ).toThrowError()
        
    })


    it( "Assign bad metadata to existing", () => {

      expect(
        () => { S.metadata = { 
          description : bad_description, 
          name : bad_name, 
          tags : bad_tags,
          varients : []
        }}
      ).toThrowError()

    })

  }
)
