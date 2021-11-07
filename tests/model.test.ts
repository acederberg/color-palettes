import { ColorsModel, ColorsSafe, MetadataSafe } from '../src/models/types'
import mongoose from 'mongoose'
import { create_model_for_user } from  '../src/models'
import static_methods from '../src/models/static'
import { params } from '../src/models/validate'

const tests : ColorsModel = create_model_for_user( "tester" ) ;
const metadata_defaults : MetadataSafe = {
	description : '',
	name : '',
	tags : [],
	varients : []
}
function create_dummy( metadata : Object ){ return { 
	colors : { itty : '#ffffff', was : '#ffffff', a : '#ffffff', test : '#ffffff' }, 
	metadata : { ...metadata_defaults, ...metadata } 
}}
function create_colors_dummy( colors : Object ){ return {
	colors : colors,
	metadata : metadata_defaults
}}

describe( 
	"Testing model creation with various metadata.description parameters.",
	function(){

		it( "Bad data. ( Description too long )",  async () => {
			expect.assertions( 1 )
			const description = 'a'.repeat( params.description.max_length + 1 ) 
			const colors : ColorsSafe = create_dummy( { description : description } )
			return static_methods.creators.create_new( tests, colors )
				.then( result => expect( result ).toEqual( params.description.illegal_length( colors.metadata.description ) ) )
		})

		it( "Bad data. ( Description with illegal characters)", () => {
			expect.assertions( 1 )
			const description = '!@#$%!#$%&agheogbaerA0'.substring( 0, params.description.max_length )
			const colors : ColorsSafe = create_dummy( { description : description } )
			return static_methods.creators.create_new( tests, colors )
				.then( result => expect( result ).toEqual( params.description.illegal_characters( colors.metadata.description ) ) )
		})
		it( "Good data. ( Description has legal characters and is not too long )", () => {
			const description = 'This is a test'.substring( 0, params.description.max_length - 1 ) 
			const dummy = create_dummy({ description : description }) 
			console.log( 'dummy', dummy )
			return static_methods.creators.create_new( tests, dummy )
				.then( result => { 
					console.log( 'result', result )
					expect( result ).toMatchObject( dummy ) 
				} ) 
		})
	}
)
describe(
	"Testing model creation with various metadata.name parameters", 
	function(){
		it( "Bad data. ( Name too long )", () => {
			expect.assertions( 1 )
			const name = 'a'.repeat( params.name.max_length + 1 )
			const colors : ColorsSafe = create_dummy( { name : name } )
			return static_methods.creators.create_new( tests, colors )
				.then( 
				      ( result ) => expect( result ).toEqual( params.name.illegal_length( colors.metadata.name ) )
				)
		})
		it( "Bad data. ( Name with illegal characters )", () => {
			expect.assertions( 1 )
			const name = 'a#$@!%EARWGQR#E'.substring( 0, params.description.max_length )
			const colors : ColorsSafe = create_dummy( { name : name } )
			return static_methods.creators.create_new( tests, colors )
				.then( result => expect( result ).toEqual( params.name.illegal_characters( colors.metadata.name ) ) )
		} )
	}
)
describe(
	"Testing model creation with various metadata.tags parameters",
	function(){
		it( "Bad data. ( Tags too long )", () => {
			expect.assertions( 1 )
			const tags = 'ab'.repeat( params.tags.max_tags + 1 ).split( 'b' )
			const colors : ColorsSafe = create_dummy( { tags : tags } )
			return static_methods.creators.create_new( tests, colors )
				.then( result => expect( result ).toEqual( params.tags.illegal_tags_length( colors.metadata.tags ) ) )
		} )
		it( "Bad data. ( A tag is too long )", () => {
			expect.assertions( 1 )
			const tags : Array<string> = [ 'a'.repeat( params.tags.max_length + 100 ) ] 
			const colors : ColorsSafe = create_dummy( { tags : tags } )
			return static_methods.creators.create_new( tests, colors )
				.then( result => expect( result ).toEqual( params.tags.illegal_length( tags[ 0 ] ) ))
		} )
	}
)
describe(
	"Testing model creation with various metadata.varients parameters",
	function(){
		it( "Bad data. ( Too many varients. )", () => {
			expect.assertions( 1 )
			const varients = 'a'.repeat( params.varients.max_length + 1 ).split('a').map( value => new mongoose.Types.ObjectId() )
			const colors : ColorsSafe = create_dummy( { varients : varients } )
			return static_methods.creators.create_new( tests, colors )
				.then( result => expect( result ).toEqual( params.varients.illegal_length( varients ) ) )
		} )
	}
)
describe(
	"Testing model creation with various colors parameters",
	function(){
		it( "Bad data. ( Bad RBG code ( contains illegal letters  ) )", () => {
			expect.assertions( 1 )
			const key = 'red'
			const value = '#q0f0f0'
			const colors_ = {}
			colors_[ key ] = value
			const colors : ColorsSafe = create_colors_dummy( colors_ )
			return static_methods.creators.create_new( tests, colors )
				.then( result => expect( result ).toEqual( { msg : [ params.colors.bad_value_format( key, value ) ] } ) )
		} )
	}
)
