import { with_decide } from './decorators'
import { create_model_for_user, static_methods, link_as_varients, find_varients as _find_varients, ColorsModel } from '../models'
import { create_request_insufficient_fields, link_request_insufficient_fields, no_filter, no_tags, no_undefined_fields, REQUEST_REQUIRED } from './msg'
import { parse_link_request_to_args, parse_varients_request_to_args } from './parsers'
import { CreateRequest, LinkRequest, VarientsRequest } from './types'


const { creators, readers, deleters, updaters } = static_methods


export async function link_palletes( request : LinkRequest )
{
	if ( !request.origin || !request.origin_id ) return link_request_insufficient_fields( true )
	else if ( !request.target_id ) return link_request_insufficient_fields( false )

	return link_as_varients( ...parse_link_request_to_args( request ) )
}


export async function read_varients( model : ColorsModel, request : VarientsRequest )
{
	if ( !request.id ) return { msg : REQUEST_REQUIRED }

	return _find_varients( model, ...parse_varients_request_to_args( request ) )
}


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
