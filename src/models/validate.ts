import { ColorsSafe, MetadataSafe, Msg, ObjectId } from './types'

function create_msg( msg : String ) : Msg
{
	return { msg : msg }
}
const alphas = /^[A-Za-z0-9]*/
const params = {
	illegal_size : ( field_name, field_value, size ) => create_msg( `Field ${ field_name } with value ${ field_value } must contain only ${ size } characters at most.` ),
	illegal_characters : ( field_name, field_value ) => create_msg( `Field ${ field_name } with value ${ field_value } has illegal characters.` ),
	colors : {
		max_key_size : 32,
		value_size : 6,
		max_length : 64,
		key_regex : alphas, 
		value_regex : /#^[ABCDEFabcdef0-9]*/,
		too_many : () => create_msg( `The colors field can contain only ${ params.colors.max_length } fields.` ),
		bad_value_format : ( key, value ) => create_msg( `Value { value } in field { key } does not follow rgb format.` ),
		bad_key_format : ( key ) => create_msg( `Key ${ key } in colors is too long or contains illegal characters. It can be at most ${ params.colors.max_key_size } characters long using alphanumeric characters.` )
	},
	name : {
		max_length : 64,
		regex : alphas,
		illegal_size : ( name ) => params.illegal_size( 'name', name, params.name.max_length ),
		illegal_characters : ( name ) => params.illegal_characters( 'name', name )
	},
	description : {
		max_length : 256,
		regex : alphas,
		illegal_size : ( description ) => params.illegal_size( 'description', description, params.description.max_length ),
		illegal_characters : ( description ) => params.illegal_characters( 'description', description )
	},
	tags : {
		max_length : 32,
		max_tags : 24,
		regex : alphas,
		illegal_size : ( tag ) => params.illegal_size( 'tag in tags', tag, params.tags.max_length ),
		illegal_tags_size : ( tags ) => create_msg( `The tags field can contain at most ${ params.tags.max_tags } tags.` ),
		illegal_characters : ( description ) => params.illegal_characters( 'description', description )
	},
	varients : {
		max_length : 32,
		illegal_size : ( varients ) => params.illegal_size( 'varients', varients, params.varients.max_length ),
	}
}


export function validate_colors( colors : Object ) : Boolean | Msg
{
	const keys = Object.keys( colors )
	if ( keys.length > params.colors.max_length ){ 
		return params.colors.too_many() 
	}
	// Check the colors keys and values using regex and length.
	for ( const [ key, value ] of Object.entries( colors ) )
	{
		if ( 
		    !( params.colors.max_key_size < key.length ) || !( params.colors.key_regex.test( key ) ) 
		){ 
			return params.colors.bad_key_format( key ) 
		}
		else if ( 
		    !( params.colors.value_size === value.length ) || !( params.colors.value_regex.test( value ) )
	        ){ 
			return params.colors.bad_value_format( key, value ) 
		}
	}
	return true
}

function validate_string( key, value )
{
	const that = params[ key ]
	if ( that.max_length < value.length )
	{
		return that.illegal_characters( value )
	}
	else if ( !that.regex.test( name ) )
	{
		return that.illegal_size( name )
	}
	else{ return true }
}
export function validate_name( name : String | undefined ) : Boolean | Msg
{
	return validate_string( 'name', name )
}
export function validate_description( description : String | undefined ) : Boolean | Msg
{
	return validate_string( 'description', description )
}
type Strings = [ String ] | [] | undefined 
type ObjectIds = [ ObjectId ] | [] | undefined

export function validate_tags( tags : Strings ) : Boolean | Msg
{
	if ( !tags ) return true
	if ( tags.length < params.tags.max_tags ){ return params.tags.illegal_tags_size( tags ) }
	let validated ;
	for ( const tag in tags )
	{
		validated = validate_string( 'tags', tag )
		if ( validated !== true ){ return validated }
	}
	return true
}
export function validate_varients( varients : ObjectIds		 )
{
	if ( !varients ) return true
	if ( varients.length < params.varients.max_length ) { return params.varients.illegal_size( varients ) }
	return true
}

export function validate_metadata( metadata : MetadataSafe ) : Boolean | Msg
{
	// Dog shit
	let result : any ;
	result = validate_tags( metadata.tags )
	if ( result !== true ) return result
	result = validate_varients( metadata.varients )
	if ( result !== true ) return result
	result = validate_name( metadata.name )
	if ( result !== true ) return result
	result = validate_description( metadata.description )
	if ( result !== true ) return result
	return true
}

export function validate_input( raw : ColorsSafe ) : Boolean | Msg
{
	let result = validate_metadata( raw.metadata )
	if ( result !== true ) return result
	result = validate_colors( raw.colors )
	if ( result !== true ) return result
	return true

}
