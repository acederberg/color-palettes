import { Express } from 'express'
import { create_palletes, read_palletes, update_palletes, delete_palletes } from '../controllers/static'
import { with_route } from './decorators'


export const URI_CREATE = '/:collection_name/create'
export const URI_READ = '/:collection_name/read'
export const URI_UPDATE = '/:collection_name/update'
export const URI_DELETE = '/:collection_name/delete'


export default function with_routes( app : Express )
{
	with_route( app, 'post', URI_CREATE, create_palletes )
	with_route( app, 'post', URI_READ, read_palletes )
	with_route( app, 'put', URI_READ, update_palletes )
	with_route( app, 'delete', URI_DELETE, delete_palletes )
}


