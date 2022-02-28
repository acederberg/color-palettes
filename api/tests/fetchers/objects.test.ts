import { PalleteFetcher, CollectionFetcher, MetadataState, State, CRUD, METHOD_IS_NOT_DEFINED } from '../../src/fetchers'
import { /*ColorsSafe, MetadataSafe, */PARAMS } from '../../src/models'


// Constants used throughout the tests

const DEFAULTS_COLLECTION : string = "defaults"
const DEFAULTS_ID : string = "000000000000000000000001"
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


beforeAll( () => fetch( 
    `${ process.env.API_URI }/create_defaults`,
    { method : 'PATCH' }
  ) 
  .catch( async ( err ) => {
    err = await err
    throw Error( `API responded with status ${ err.status_code }. err = ${ err }` )
  })
)


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


describe(
  "Testing the CRUD base object.",
  function()
  {

    let A_CRUD

    it( "Constructor should make an object with '_create', '_read', '_update', and '_delete'.", () => {
      
      A_CRUD = new CRUD( "tests", ( err ) => { msg : err } )

      expect( Object.keys( A_CRUD ) ).toEqual(
        expect.arrayContaining([ '_create', '_read', '_update', '_delete' ])
      )

      expect( A_CRUD.read() ).toEqual( METHOD_IS_NOT_DEFINED() ) 

    })

  }
)


describe(
  "Testing PalleteFetcher",
  function()
  {

    let PALLETE_FETCHER
    let PALLETE, POPPED

    it( "Testing pallete_fetcher constructor", () => {

      expect( 
        () => {
          PALLETE_FETCHER = new PalleteFetcher( DEFAULTS_COLLECTION, DEFAULTS_ID, ( err ) => { throw err } )
        } 
      ).not.toThrowError()
      expect( PALLETE_FETCHER.initialId ).not.toBeFalsy()
      expect( PALLETE_FETCHER.state ).toBeFalsy()

    })


    it( "Testing pallete_fetcher.read'.", async () => {

      PALLETE = await PALLETE_FETCHER.read()
        .then( result => { console.log( result ) ; return result } )
        .catch( err => { throw err } )
      
      expect( PALLETE ).not.toMatchObject({ msg : expect.stringContaining("") })
      // underscored since fetched should be a state object
      expect( Object.keys( PALLETE ) ).toEqual( 
        expect.arrayContaining([ '_metadata', '_colors' ])
      )
      expect( PALLETE.colors ).not.toBeFalsy()

    })


    it( "Testing 'pallete_fetcher.update'.", async () => {
      
      // PALLETE_FETCHER.state.colors.green = "#00ff00"
      const result = await PALLETE_FETCHER.update()
        .catch( err => { throw err } )
      expect( result.length ).toBe( 0 )

    })

    it( "Testing 'pallete_fetcher.delete'.", async () => {
      
      // Delete the object. Should have pallete returned abd state nullified
      POPPED = await PALLETE_FETCHER.delete()
        .catch( err => { throw err } )
  
      expect( POPPED ).not.toBeFalsy()
      expect( PALLETE.dump() ).toMatchObject( POPPED )
      expect( PALLETE.state ).toBeFalsy()
      
      const result = await PALLETE_FETCHER.read()
        .catch( err => { throw err } )

      expect( result ).toStrictEqual( {} )
    
    })

    it( "Testing 'pallete_fetcher.create' using the entry deleted in the previous test.", async() => {
      
      PALLETE_FETCHER.state = PALLETE
      const result = await PALLETE_FETCHER.create()
        .catch( err => { throw err } )
      expect( result.colors ).toMatchObject( PALLETE_FETCHER.state.dump().colors )
      expect( result.id ).not.toStrictEqual( PALLETE.initialId )

    })
  }
)


describe( "Testing 'CollectionFetcher'.", 
  function()
  {
    let COLLECTION_FETCHER
    const PALLETE = {
      'colors' : {
        a : '#000',
        b : '#111',
        c : '#222',
        d : '#333',
        e : '#444',
        f : '#555',
        g : '#666',
        h : '#777'
      },
      metadata : {
        tags : [ 'a', 'test', 'for', 'client' ],
        description : 'A test for client',
        name : 'Test',
        varients : []
      }
    }

    it( "Testing 'CollectionFetcher' constructor.", () => {
      expect(
        () => {
          COLLECTION_FETCHER = new CollectionFetcher( 'tests', ( err ) => { throw err } )
        }
      ).not.toThrowError()
    })


    it( "Testing 'CollectionFetcher.create'.", async () => {
      // Create defaults
      let result = await COLLECTION_FETCHER.create()
        .catch( err => { throw err } )
      expect( result ).toBe( undefined )

      result = await COLLECTION_FETCHER.create( PALLETE )
        .catch( err => { throw err } ) 
      expect( result ).toMatchObject( PALLETE )
    })


    it( "Testing 'CollectionFetcher.read'.", async () => {
      let result = await COLLECTION_FETCHER.read()
        .catch( err => { throw err } )
      expect( result.length ).toStrictEqual( 4 ) 
    })


    it( "Testing 'CollectionFetcher.update'.", async () => {
      let result = await COLLECTION_FETCHER.update(
        { amendments : { '$set' : { 'colors' : { 'white' : '#fff' } } } }
      )
      console.log( result )
      expect( result )
    })


    it( "Testing 'CollectionFetcher.delete'.", async () => {
      let result = await COLLECTION_FETCHER.delete()
        .catch( err => { throw err } )
      expect( result.length ).toStrictEqual( 4 )

      result = await COLLECTION_FETCHER.read()
      expect( result.length ).toStrictEqual( 0 )
    })

    console.log( COLLECTION_FETCHER )
  }
)
