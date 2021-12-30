import { Express } from 'express'

import { Request } from '../controllers'
import { create_model_for_user } from '../models'


const REQUIRES_BODY = "Requests made to this endpoint require a 'JSON' body."	
const DELIMETER = ','


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

	const request : Request = {
		collection : 'foo',
		id : <string>params._id ,
		ids : ( queries._ids as string ).split( DELIMETER ),
		tags : {
			items : ( queries.tags as string ).split( DELIMETER ),
			containment : queries.containment
		}
	}

	return request

}


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
