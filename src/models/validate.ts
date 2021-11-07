import { ColorsSafe, MetadataSafe, Msg, ObjectId } from './types'

function create_msg( msg : string ) : Msg
{
	return { msg : [ msg ] }
}
const alphas = /^[A-Za-z0-9 -]*$/g
export const params = {
	illegal_length : ( field_name, field_value, length ) => create_msg( `Field '${ field_name }' with value '${ field_value }' must contain only '${ length }' characters at most. Current length = '${ field_value.length }'.` ),
	illegal_characters : ( field_name, field_value ) => create_msg( `Field '${ field_name }' with value '${ field_value }' has illegal characters.` ),
	colors : {
		max_key_length : 32,
		max_length : 64,
		key_regex : /^[a-z]*$/, 
		value_regex : /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
		too_many : () => create_msg( `The colors field can contain only '${ params.colors.max_length }' fields.` ),
		bad_value_format : ( key, value ) => `Value '${ value }' in field '${ key }' does not follow rgb format.`,
		bad_key_format : ( key ) => `Key '${ key }' in colors is too long or contains illegal characters. It can be at most '${ params.colors.max_key_length }' characters long using alphanumeric characters.`
	},
	name : {
		max_length : 64,
		regex : alphas,
		illegal_length : ( name ) => params.illegal_length( 'name', name, params.name.max_length ),
		illegal_characters : ( name ) => params.illegal_characters( 'name', name )
	},
	description : {
		max_length : 256,
		regex : alphas,
		illegal_length : ( description ) => params.illegal_length( 'description', description, params.description.max_length ),
		illegal_characters : ( description ) => params.illegal_characters( 'description', description )
	},
	tags : {
		max_length : 32,
		max_tags : 24,
		regex : alphas,
		illegal_length : ( tag ) => params.illegal_length( 'tag in tags', tag, params.tags.max_length ),
		illegal_tags_length : ( tags ) => create_msg( `The tags field can contain at most '${ params.tags.max_tags }' tags. ( current size = '${ tags.length }' )` ),
		illegal_characters : ( description ) => params.illegal_characters( 'description', description )
	},
	varients : {
		max_length : 32,
		illegal_length : ( varients ) => params.illegal_length( 'varients', varients, params.varients.max_length ),
	}
}


export function validate_colors( colors : Object ) : boolean | Msg
{
	const keys = Object.keys( colors )
	if ( keys.length > params.colors.max_length ){ 
		return params.colors.too_many() 
	}
	// Check the colors keys and values using regex and length.
	
	const errs = Object.keys( colors ).map( key => {
			const value = colors[ key ]		
			const key_passes_regex = params.colors.key_regex.test( key ) 
			const key_has_legal_length = ( params.colors.max_key_length > key.length )
			const value_passes_regex = params.colors.value_regex.test( value )

			console.log({ 
				key, 
				value, 
				key_passes_regex, 
				key_regex : params.colors.key_regex, 
				key_has_legal_length, 
				value_regex : params.colors.value_regex, 
				value_passes_regex : params.colors.value_regex.test( value ) 
			})

			if ( key_passes_regex && key_has_legal_length && value_passes_regex ){ 
				return true
			}
			else if ( !key_passes_regex || !key_has_legal_length ){ 
				return params.colors.bad_key_format( key )
			}
			else{ 
				return params.colors.bad_value_format( key, value ) 
			}

	})
	const filtered = errs.filter( item => item !== true )
	
	return ( filtered.length > 0 ) ? { msg : filtered } : true
}

function validate_string( key, value )
{
	const that = params[ key ]
	// that.length === 0 b/c regex fails for empty
	if ( !value ){ return true }
	else if ( that.max_length < value.length )
	{
		return that.illegal_length( value )
	}
	else if ( !that.regex.test( value ) )
	{
		return that.illegal_characters( value )
	}
	else{ return true }
}
export function validate_name( name : string | undefined ) : boolean | Msg
{
	return validate_string( 'name', name )
}
export function validate_description( description : string | undefined ) : boolean | Msg
{
	return validate_string( 'description', description )
}
type strings = string[] | undefined 
type ObjectIds = ObjectId[] | [] | undefined

export function validate_tags( tags : strings ) : boolean | Msg
{
	if ( !tags ) return true
	if ( tags.length > params.tags.max_tags ){ return params.tags.illegal_tags_length( tags ) }
	let validated ;
	for ( const tag in tags )
	{
		validated = validate_string( 'tags', tags[ tag ] )
		if ( validated !== true ){ return validated }
	}
	return true
}
export function validate_varients( varients : ObjectIds )
{
	if ( !varients ) return true
	if ( varients.length > params.varients.max_length ) { return params.varients.illegal_length( varients ) }
	return true
}

export function validate_metadata( metadata : MetadataSafe ) : boolean | Msg
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

export default function validate_input( raw : ColorsSafe ) : boolean | Msg
{
	let result = validate_metadata( raw.metadata )
	if ( result !== true ) return result
	result = validate_colors( raw.colors )
	if ( result !== true ) return result
	return true

}
