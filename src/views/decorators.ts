import { Express } from 'express'

import { Request, Tags } from '../controllers'
import { create_model_for_user } from '../models'


const REQUIRES_BODY = "Requests made to this endpoint require a 'JSON' body."	
const DELIMETER = ','


// PARSERS and ERROR HANDLING

export function parse_uri_query( params : any, queries : any ) : Request
{
	// For `GET` requests.
	//
	// Existing Parameters :
	// - `collection_name` -- This will be used later.
	//
	// Additional Parameters :
	// - `_id` -- A string for an objectId_.
	// - `_ids` -- Comma separed following the above format.
	// - `tags` -- A comma separated string of tags.
	// - `containment` -- Determines if a all or a few of the tags

	const id : string = queries?.id
	const ids : string[] = queries?.ids?.split( DELIMETER )
	const tags : Tags = {
		items : queries?.tags?.split( DELIMETER ),
		containment : queries?.containment
	}
	const varients : string[] = queries?.varients
	
	const request_ : Request = {
		collection : '',
		id : id,
		ids : ids,
		tags : !tags.items ? undefined : tags,
		varients : varients
	}
	return request_

}
				

export function create_error_msg( result, err )
{
	console.log( err )
	result.status( 500 )
	return result.json({ 
		msg : ( err as Error ).message
	})
}



// DECORATORS

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
