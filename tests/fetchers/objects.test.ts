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


    it( "Testing validation for the description property.", () => {
      
      expect( 
        () => { M.description = 'a'.repeat( PARAMS.description.max_length + 1 ) }
      ).toThrowError()

      expect(
        () => { M.description = test_description }
      ).not.toThrowError()
  
    })
     
  
    it( "Testing validation for the name property.", () => {
      
      expect(
        () => { M.name = 'a'.repeat( PARAMS.name.max_length + 1 ) }
      ).toThrowError()

      expect(
        () => { M.name = test_name }
      ).not.toThrowError()

    })

  }
)
