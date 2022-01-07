import { CreateRequest, Request } from './types'
import { create_model_for_user, static_methods, ColorsModel } from '../models'
import { create_request_insufficient_fields, no_filter, no_tags, no_undefined_fields, tags_fields_undefined, REQUEST_REQUIRED } from './msg'
import { parse_tags } from './parsers'



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
const { creators, readers, deleters, updaters } = static_methods

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
