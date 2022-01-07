import { Express } from 'express'

import { Request } from '../controllers'
import { create_model_for_user } from '../models'
import { parse_uri_query, parse_out_args } from './parsers'


const REQUIRES_BODY = "Requests made to this endpoint require a 'JSON' body."	


export function create_error_msg( result, err )
{
	result.status( 500 )
	return result.json({ 
		msg : ( err as Error ).message
	})
}



// DECORATORS

export function with_route( app : Express, http_method : string, route : string, method : Function, no_json : boolean = false )
{
	// http_method : some HTTP method.
	// route : uri to attach method to.
	// method : Some method like `method( collection : String, ...args, request : Request | CreateRequest )`. Usually decorated by 'with_decide'.
	// no_json : When true, then endpoint should not return json.

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
					...parse_out_args( get_json( request ) )
				)

				if ( !no_json && result_[ 'msg' ] ) result.status( 400 )

 				result.json( result_ )

			}
			catch( err ){ create_error_msg( result, err ) }

		}
	)

}


export function with_parameterized_route( app : Express, http_method : string, route : string, method : Function )
{
	// Uses default parsing.
	return app[ http_method ](
		route,
		async ( request, result ) => {

			try{
				const collection = create_model_for_user( request.params[ 'collection_name' ] )
				const request_ : Request = parse_uri_query( request.params, request.query )
				const result_ = await method( collection, request_ )
				if ( result_[ 'msg' ] ) result.status( 400 )
				result.json( result_ )
			}
			catch( err ){ create_error_msg }

		}
	)

}
