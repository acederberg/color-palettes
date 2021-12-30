import { Express } from 'express'
import { create_model_for_user } from '../models'


const REQUIRES_BODY = "Requests made to this endpoint require a 'JSON' body."	


export function with_route( app : Express, http_method : string, route : string, method : Function, no_json : boolean = false )
{
	// console.log( http_method, route, app[ 'get' ] )
	const get_json = no_json ? ( ( request ) => {} ) : ( ( request ) => request.body )

	return app[ http_method ](
		route,
		async ( request, result ) => {

			// Try to execute method. If a collection_name is included in the parameters, 
			// then make a model out of it.
			
			if ( !no_json && !request.body ) 
			{
			
				result.status( 400 )
				result.json({ msg : REQUIRES_BODY })
				return 
			
			}
			try{

				const collection = request.params[ 'collection_name' ]
				const result_ = await method( 
					collection ? create_model_for_user( collection ) : null,
					get_json( request )
				)
 				result.json( result_ )

			}
			catch( err ){

				result.status( 500 )
				result.json({ 
					msg : ( err as Error ).message
				})

			}

		}
	)

}
