import { MetadataState } from '../../src/fetchers'
import { MetadataSafe, PARAMS } from '../../src/models'

describe( 
  "Testing the 'metadataState' object",
  function()
  {

    let M : MetadataSafe ;
    const test_name = 'a'.repeat( PARAMS.name.max_length - 1 )
    const test_description = 'a'.repeat( PARAMS.description.max_length - 1)
    const test_tags = Array( Array( PARAMS.tags.max_tags ) ).map( 
      value => 'a'.repeat( PARAMS.tags.max_length - 1 )
    )

    const bad_name = 'a'.repeat( PARAMS.name.max_length + 1 ) 
    const bad_description = 'a'.repeat( PARAMS.description.max_length + 1 ) 
    const bad_tags =
      Array( Array( PARAMS.tags.max_tags ) ).map( 
      value => 'a'.repeat( PARAMS.tags.max_length + 1 )
    )


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
