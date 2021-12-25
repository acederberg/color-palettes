import { tests, create_dummy, create_dummy_with_colors, cleanUp, setUp/*, create_colors_dummy */} from './base'
import { ColorsSafe } from '../src/models'
import static_methods from '../src/models/static'


const tags = [ 'this', 'is', 'a', 'test' ]
const tags_again = [ 'another', 'test' ]
const colors = { grey : '#888888' }
const colors_again = { blue : '#338a57', red : '#ff8888' }
const with_tags : ColorsSafe = create_dummy({ tags : tags })
const with_tags_again : ColorsSafe = create_dummy_with_colors({ tags : tags_again }, '#ff8a77')


beforeAll( async () => await setUp() )
afterAll( cleanUp )


describe( 
	"Testing `static_methods.readers`.",
	function(){

		const create_new = ( with_some_tags ) => {
			expect.assertions( 1 )
			return static_methods.creators.create_new( tests, with_some_tags ) 
        .then( 
          ( result ) => expect( result ).toMatchObject( with_some_tags )
		    )
    }
		const check_result_contains_tags = ( some_tags, index, length ) => {
			return static_methods.readers.read_containing_tags( tests, some_tags )
				.then(
					( result ) => {
						if ( result === [] ){
							expect.assertions( 2 )
							expect( result[ index ].metadata ).toEqual(
								expect.objectContaining(
									{ tags : expect.arrayContaining( some_tags ) } 
								)
							)
							expect( result.length ).toBe( length )
						} else {
							expect.assertions( 1 )
							expect( result.length ).toBe( length )
						}
					}
				)
		}


		const check_result_intersects_tags = ( some_tags, length ) => {
			return static_methods.readers.read_intersecting_tags( tests, some_tags )
				.then(
					( result ) => {
						if ( result.length !== 0 )
						{
							expect.assertions( 2 )
							const intersections = result
								.map( item => item.metadata.tags )
								.filter( 
									item => item.filter( value => item.includes( value ) ).length !== 0
								)

							expect( intersections.length ).not.toEqual( 0 )

							expect( result.length ).toEqual(
								length
							)
						}
					}
				)
		}


		it( "Creating junk data to do a search by tags.", () => create_new( with_tags ) )
		it( "Creating more junk data with different tags.", () => create_new( with_tags_again ) )


		// Tests for full containment.
		it( "Searching by containment using a mutual tag ( test )", () => check_result_contains_tags( [ 'test' ], 0, 2 ) )
		it( "Searching by containment using the tags used in the previous step.", () => check_result_contains_tags( tags, 0, 1 ) )
		it( "Searching by containment using the tags used in the previous step.", () => check_result_contains_tags( tags_again, 0, 1 ) )
		it( "Searching by containment using no tags.", () => check_result_contains_tags( [], 0, 0 ) )
		it( "Searching by containment using the union of both sets of tags", () => check_result_contains_tags([ 'this', 'is', 'a', 'another', 'test' ], 0, 0) )


		// Tests for intersection.
		it( "Search by intersection using 'tags'.", () => check_result_intersects_tags( tags, 2) )
		it( "Search by intersection using 'tags_again'.", () => check_result_intersects_tags( tags_again, 2) )
		it( "Search by intersection using empty tags", () => check_result_intersects_tags( [], 0 ) )

	
		// Read all
		it( "", () => {
			expect.assertions( 3 )
			return static_methods.readers.read_all( tests )
				.then(
					( result ) => {
						[ tags, tags_again ].map( some_tags => expect( result ).toEqual(
							expect.arrayContaining([
								expect.objectContaining( 
									{ metadata : expect.objectContaining( { tags : expect.arrayContaining( some_tags ) } ) }
								)
							])
						))
						expect( result.length ).toEqual( 2 )
					}
				)
		})


		// Read using a filter.
		it( "Using filter.", () => {
			expect.assertions( 2 )
			return static_methods.readers.read_filter( tests, { 'metadata.tags' : tags } )
				.then( 
					( result ) => {
						expect( result ).toEqual(
							expect.arrayContaining([
								expect.objectContaining(
									{ metadata : expect.objectContaining( { tags : tags } ) }
								)
							])
						)
						expect( result.length ).toEqual( 1 )
					}
				)
		})

	
	}
)


describe( "Tests for the `update` methods.", 
	function(){

		const get_modified_length = result => result[0].metadata.modified.length
		const update_with_filter = ( updates, filter, result ) => {
			// Assumes that the length of the filtered results is 1
			expect.assertions(3)

			return static_methods.readers.read_filter( tests, filter )
				.then( 
					async ( before ) => {
						const after = await static_methods.updaters.update_filter( tests, updates, filter )
						return { before, after }
					}
				)
				.then( 
						({ before, after }) => {
						expect( after ).toEqual(
							expect.arrayContaining([
								expect.objectContaining( result )
							])
						)
						expect( after.length ).toEqual( 1 )
						console.log( before, after )
						expect( get_modified_length( after ) ).toEqual( get_modified_length( before ) + 1 )
					}
				)
		}

		[ colors, colors_again ].map( somebody => it( 
				"Update an entries body. Check that body was updated", 
				() => update_with_filter(
					{ '$set' : { colors : colors } },
					{ 'metadata.tags' : tags },
					{ colors : colors }
				) 
			)
		)


	}
)


describe(
	"Test 'static_methods.delete'. Only tests delete all since we have tested the other queries theroughly.",
	function(){

		it( "Delete all of the previous tests.", () => {

			expect.assertions( 2 )
			return static_methods.deleters.delete_all( tests )
				.then(
					( result ) => {
						expect( result ).toEqual(
							expect.arrayContaining([
								expect.objectContaining( {
									metadata : expect.objectContaining({ tags : tags }),
								}),
								expect.objectContaining( { 
									metadata :  expect.objectContaining({ tags :  tags_again }) 
								})
							])
						)
						expect( result.length ).toEqual( 2 )
					}
				)

		})


		it( "Check that the documents were actually deleted.", () => {
			
			return static_methods.readers.read_all( tests )
				.then(
					( result ) => expect( result.length ).toEqual( 0 )
				)
		
		})

		
	}
)
