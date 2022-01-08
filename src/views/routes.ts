import { Express } from 'express'

import { create_palletes, read_palletes, update_palletes, delete_palletes } from '../controllers/static'
import { with_route, with_parameterized_route, create_error_msg } from './decorators'
import { link_palletes } from '../controllers'


export const URI_CREATE = '/:collection_name/create'
export const URI_READ = '/:collection_name/read'
export const URI_UPDATE = '/:collection_name/update'
export const URI_DELETE = '/:collection_name/delete'
export const URI_LINK = '/link'


export function create_link( app : Express )
{
	app.patch( 
		URI_LINK,
		async ( request, result ) => {
			try
			{
				const _result = await link_palletes( request.body )
				result.status( 200 )
				result.send( _result )
			}
			catch ( err )
			{
				create_error_msg( result, err )
			}

		}
	)
}


export default function create_routes( app : Express )
{
	// Ad hoc
	create_link( app )

	// Decorated
	with_route( app, 'post', 		URI_CREATE, 	create_palletes )
	with_route( app, 'post', 		URI_READ, 		read_palletes 	)
	with_route( app, 'put', 		URI_UPDATE, 	update_palletes )
	with_route( app, 'delete', 	URI_DELETE, 	delete_palletes )
	with_parameterized_route( app, 'get', URI_READ, read_palletes )
}


