import { with_decide } from './decorators'
import { create_model_for_user, static_methods, ColorsModel } from '../models'
import { create_request_insufficient_fields, no_filter, no_tags, no_undefined_fields, REQUEST_REQUIRED } from './msg'
import { CreateRequest } from './types'


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
