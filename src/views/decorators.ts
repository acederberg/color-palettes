import { Express } from 'express'
import { create_model_for_user } from '../models'


export function with_route( app : Express, http_method : string, route : string, method : Function, no_json : boolean = false )
{
	// console.log( http_method, route, app[ 'get' ] )
	const get_json = no_json ? ( ( request ) => {} ) : ( ( request ) => request.json() )


	return app[ http_method ](
		route,
		( request, result ) => {

			// Try to execute method. If a collection_name is included in the parameters, 
			// then make a model out of it.
			try{
				const collection = request.params[ 'collection_name' ]
				const content = JSON.stringify(
					method( 
						collection ? create_model_for_user( collection ) : null,
						get_json( request )
					)
				)
				result.send( content )
			}
			catch( err ){
				console.log( err )
				result.status( 500 )
				result.send({ 
					msg : ( err as Error ).message
				})
			}

		}
	)
}
