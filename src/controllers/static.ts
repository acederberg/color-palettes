import { CreateRequest, Msg, Request, RequestParsed } from './types'
import { create_model_for_user, static_methods, ColorsModel } from '../models'


const { creators, readers, deleters, updaters } = static_methods


// MESSAGES and FIELDS

//const DELIMETER = ', '
export const CREATE_REQUEST_FROM_EXISTING_KEYS = [ 'origin_id', 'origin', 'amendments' ]
export const FIELDS = [ 'id', 'ids', 'filter', 'tags' ]
export const INSUFFICIENT_FIELDS = "Insufficient fields."
export const NO_FILTER = "Filtering is not supported."
export const NO_TAGS = "Tags are not supported."
export const NO_UNDEFINED_FIELDS : string = `At least one field is required.`
export const REQUEST_REQUIRED : string = "A request is required."
export const TAGS_CONTAINMENT_VALUE : boolean = true
export const TAGS_FIELDS_UNDEFINED : string = "All tags fields are undefined. Did you mean to add a uri query?"
export const TAGS_REQUIRES_ITEMS = "Request including tags as an object must include a tags field and it must be an array."


const create_request_insufficient_fields = ( model, request ) => { 
	return {
		msg : INSUFFICIENT_FIELDS + ` Missing the following mutually necessary fields ${ find_missing_fields( request, CREATE_REQUEST_FROM_EXISTING_KEYS ).join(',') } or the mutually exclusive 'content' field.` 
	}
}

export const no_undefined_fields = ( model, request ) => {
	return {
		msg : NO_UNDEFINED_FIELDS + find_missing_fields( request, FIELDS )
	}
}

const no_filter = msg( NO_FILTER )
const no_tags = msg( NO_TAGS )
const tags_fields_undefined = msg( TAGS_FIELDS_UNDEFINED )


export function msg( msg_ : string ) : Function
{
	// Takes these arguements since such arguements will be passed down by the decorators.
	return function( model : ColorsModel, args : any ) : Msg
	{
		return { msg : msg_ }
	}
}


function find_missing_fields( request : CreateRequest, FIELDS : string[] )
{
	const fields = Object.keys( request )
	return FIELDS
		.filter( 
			( field ) => !fields.includes( field )
		)
		.map( 
			( field ) => `'${field}'`
		)
}



// PARSERS

export function parse_tags( request : Request ) : RequestParsed
{
	// Only called by decide when tags take precedence.
	// Functional parser.
	console.log( '@parse_tags', request )
	const raw_tags : Object = { ...request.tags } 
	const keys = Object.keys( raw_tags )
	const out : any = { ...request }

	if ( keys.includes( '0' ) )
	{
		out[ 'tags' ] = {
			items : request.tags,
			containment : TAGS_CONTAINMENT_VALUE
		}
	}
	else if ( keys.includes( 'items' ) )
	{
		if ( !keys.includes( 'containment' ) ){
			out[ 'tags' ][ 'containment' ] = TAGS_CONTAINMENT_VALUE
		}
	}
	else throw Error( TAGS_REQUIRES_ITEMS )

	return out

}



// DECORATORS.

export function with_decide({ method_id, method_ids, method_filter, method_intersecting_tags, method_containing_tags, method_varients }, otherwise )
{
	return function ( model : ColorsModel, request : Request, ...args )
	{
		// Decides what to do when multiple snippets are provided in a request.
		// Unpack args in the middle since methods decorated with 'with_update' need it.
		// Precidence : `id` > `_ids` > `filter` > `tags`
		if ( request.id !== undefined )
		{
			return method_id( model, ...args, request.id )
		}
		else if ( request.ids !== undefined )
		{
			return method_ids( model, ...args, request.ids )
		}
		else if ( request.filter !== undefined )
		{
			return method_filter( model, ...args, request.filter )
		}
		else if ( request.tags !== undefined )
		{
			const parsed = parse_tags( request )
			if ( !parsed.tags || !parsed?.tags.items )
			{
				return tags_fields_undefined()
			}
			const result = parsed.tags.containment 
				? method_containing_tags( model, ...args, parsed.tags.items )
				: method_intersecting_tags( model, ...args, parsed.tags.items )
			return result
		}
		else if ( request.varients !== undefined )
		{
			return method_varients( model, request )
		}
		else 
		{
			return otherwise( model, request )
		}
	}
}



// THE GOOD STUFF

export async function create_palletes( model : ColorsModel, request : CreateRequest )
{
	if ( !request ) return { msg : REQUEST_REQUIRED }

	var output
	if ( request[ 'content' ] !== undefined ) output = await creators.create_new( model, request[ 'content' ] )
	else if ( request[ 'origin' ] !== undefined && request[ 'origin_id' ] !== undefined && request[ 'amendments' ] !== undefined )
	{
		const origin = create_model_for_user( request[ 'origin' ] )
		output = await creators.create_new_from_existing_by_id( origin, model, request[ 'origin_id' ], request[ 'amendments' ] )
	}
	else
	{
		output = create_request_insufficient_fields( model, request )
	}

	return output

}


export const read_palletes = with_decide(
	{
		method_id : readers.read_id,
		method_ids : readers.read_ids,
		method_filter : readers.read_filter,
		method_containing_tags : readers.read_containing_tags,
		method_intersecting_tags : readers.read_intersecting_tags,
		method_varients : readers.read_varients
	}, 
	no_undefined_fields
)


export const delete_palletes = with_decide(
	{
		method_id : deleters.delete_id,
		method_ids : deleters.delete_ids,
		method_filter : no_filter,
		method_containing_tags : no_tags,
		method_intersecting_tags : no_tags,
		method_varients : deleters.delete_varients
	},
	no_undefined_fields
)


export const update_palletes = with_decide(
	{
		method_id : updaters.update_id,
		method_ids : updaters.update_ids,
		method_filter : updaters.update_filter,
		method_containing_tags : updaters.update_containing_tags,
		method_intersecting_tags : updaters.update_intersecting_tags,
		method_varients : updaters.update_varients
	},
	no_undefined_fields
)
