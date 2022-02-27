import { Express } from 'express'

//import { create_model_for_user } from '../models'
import { link_palletes, read_varients } from '../controllers'
import { create_palletes, read_palletes, update_palletes, delete_palletes } from '../controllers/static'
import { add_defaults } from '../models'

import { with_route, with_parameterized_route, create_error_msg } from './decorators'


export const URI_CREATE = '/:collection_name/create'
export const URI_READ = '/:collection_name/read'
export const URI_UPDATE = '/:collection_name/update'
export const URI_DELETE = '/:collection_name/delete'
export const URI_LINK = '/link'
export const URI_VARIENTS = '/:collection_name/varients'
export const URI_CREATE_DEFAULT_PALLETES = '/create_defaults'


function with_catch_internal_error( method : Function )
{
	return function( request, result ){
		try
		{
			method( request, result )
		}
		catch ( err )
		{
			create_error_msg( result, err )
		}
	}
}


export function create_link_varients( app : Express )
{
	const method = with_catch_internal_error(
		async ( request, result ) => {
			const _result = await link_palletes( request.body )
			result.status( 200 )
			result.send( _result )
		}
	)

	app.patch( 
		URI_LINK,
		method	
	)
}


export function create_create_default_palletes( app : Express )
{
	const method = with_catch_internal_error(
		async ( request, result ) => {
			const _result = await add_defaults()
			result.status( 200 )
			result.send( _result )
		}
	)
	
	app.patch(
		URI_CREATE_DEFAULT_PALLETES,
		method
	)
}
/*
export function create_read_varients( app : Express )
{
	const method = with_catch_internal_error(
		async (request, result ) => {
			const model = create_model_for_user( request.params.collection_name )
			const _result = await read_varients( model, request.body )
			result.status( 200 )
			result.send( _result )
		}
	)

	app.post(
		URI_VARIENTS,
		method
	)
}
*/

export default function create_routes( app : Express )
{
	// Ad hoc
	create_link_varients( app )
	create_create_default_palletes( app )
	//create_read_varients( app )

	// Decorated
	with_route( app, 'post', 		URI_CREATE, 	create_palletes )
	with_route( app, 'post', 		URI_READ, 		read_palletes 	)
	with_route( app, 'put', 		URI_UPDATE, 	update_palletes )
	with_route( app, 'delete', 	URI_DELETE, 	delete_palletes )
	with_route( app, 'post', 		URI_VARIENTS, read_varients )
	with_parameterized_route( app, 'get', URI_READ, read_palletes )
}


