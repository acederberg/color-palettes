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
			const description = 'a '.repeat( params.description.max_length + 1 ) 
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
			return static_methods.creators.create_new( tests, dummy )
				.then( result => expect( result ).toMatchObject( dummy ) ) 
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
		it( "Good data. ( Name with legal characters of appropriate length )", () => {
			expect.assertions( 1 )
			const  name = 'This is a test name'.substring( 0, params.description.max_length )
			const colors : ColorsSafe = create_dummy( { name : name } )
			return static_methods.creators.create_new( tests, colors )
				.then( result => expect( result ).toMatchObject( colors ) )
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
		it( "Bad data. ( A tag has illegal characters )", () => {
			expect.assertions( 1 )
			const tags : Array<string> = [ 'awrgh0pi2345hyQ#$T#!Q$T$@%!$TRFERGQ#$%Q'.substring( 0, params.tags.max_length ) ]
			const colors : ColorsSafe = create_dummy( { tags : tags } )
			return static_methods.creators.create_new( tests, colors )
				.then( result => expect( result ).toEqual( params.tags.illegal_characters( tags[ 0 ] ) ) )
		})
		it( "Good data. ( a legal set of tags of approiate length ).", () => {
			const tags : Array<string> = 'a'
				.repeat( params.tags.max_tags - 1 )
				.split('a')
				.map( key => 'a test is a test'.substring( 0, params.tags.max_length - 1 ) )
			const colors : ColorsSafe = create_dummy( { tags : tags } )
			return static_methods.creators.create_new( tests, colors )
				.then( result => expect( result ).toMatchObject( colors ) )
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
		it( "Good data. ( An appropriate number of varients )", () => {
			expect.assertions( 1 )
			const varients = [ 'This is a test. Tests make your code suck less.'.substring( 0, params.varients.max_length - 1 ) ]
			const colors : ColorsSafe = create_dummy( { varients : varients } )
			return static_methods.creators.create_new( tests, colors )
				.then( result => {
					console.log( result )
					return expect( result ).toMatchObject( colors ) } )
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
		it( "Bad data. ( Key has illegal characters )", () => {
			expect.assertions( 1 )
			const key = 'QWEGQ@!#$^#$%#$RERs'.substring( 0, params.colors.max_key_length )
			const value = '#ffffff'
			var colors_ = {}
			colors_[ key ] = value
			const colors : ColorsSafe = create_colors_dummy( colors_ )
			return static_methods.creators.create_new( tests, colors ) 
				.then( result => expect( result ).toEqual( { msg : [ params.colors.bad_key_format( key ) ] } ) )
		} )
		it( "Bad data. ( Key is too long )", () => {
			expect.assertions( 1 )
			const key = 'a'.repeat( params.colors.max_key_length ) 
			const value = '#abcdef'
			var colors_ = {}
			colors_[ key ] = value
			const colors : ColorsSafe = create_colors_dummy( colors_ )
			return static_methods.creators.create_new( tests, colors )
				.then( result => expect(result).toEqual( { msg : [ params.colors.bad_key_format( key ) ] } ) )
		})
		/*it( "Bad data. ( Too many colors )", () => {
			expect.assertions( 1 )
			const key = 'a'.repeat( params.colors.max - 1 )
			const value = '#0Fab71'
			var colors_ = {}
			
			colors_[ key ] = values
			const colors : ColorsSafe = create_colors_dummy( colors_ )
			return static_methods.creators.create_new( tests, colors )
				.then( result => expect( result ).toEqual){ msg : [ 
		})*/
		it( "Good data. ( 3 long rgbs and 6 long rgbs )", () => {
			expect.assertions( 1 )
			const colors : ColorsSafe  = create_colors_dummy( {
				red : '#f00', lightRed : '#ff5722',
				green : '#0f0', lightGreen : '#57ff22',
				blue : '#00f', lightBlue : '#2257ff'
			})
			return static_methods.creators.create_new( tests, colors )
				.then( result => expect( result ).toMatchObject( colors ) )
		})
	}
)
