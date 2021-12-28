import { Express } from 'express'
import { create_model_for_user } from '../models'

export function with_route( app : Express, http_method : string, route : string, method : Function )
{
	return app[ http_method ](
		route,
		( request, result ) => result.send(
			JSON.stringify(
				method( 
					create_model_for_user( request.params[ 'collection_name' ] ),
					request.json() 
				)
			)
		)
	)
}
