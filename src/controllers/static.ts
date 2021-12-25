import { Request } from './types'
import { ColorsModel } from '../models/types'
//import static_methods from '../models/static'


//const { readers, creators, deleters, updaters } = static_methods
export const TAGS_REQUIRES_ITEMS = "Request including tags as an object must include a tags field and it must be an array."
export const TAGS_CONTAINMENT_VALUE : boolean = true


export function parse_tags( request : Request ) : Request
{
	// Only called by decide when tags take precedence.
	// Functional parser.
	const raw_tags : Object = { ...request.tags } 
	const keys = Object.keys( raw_tags )
	
	const out : any = { ...request }

	if ( keys.includes( '0' ) )
	{
		out[ 'tags' ] = {
			items : request.tags,
			containment : TAGS_CONTAINMENT_VALUE
		}
	}
	else if ( keys.includes( 'items' ) )
	{
		if ( !keys.includes( 'containment' ) ){
			out[ 'tags' ][ 'containment' ] = TAGS_CONTAINMENT_VALUE
		}
	}
	else throw Error( TAGS_REQUIRES_ITEMS )

	return out

}


// Decorators.


export function with_decide({ method_id, method_ids, method_filter, method_tags }, otherwise )
{
	return function ( model : ColorsModel, request : Request )
	{
		// Decides what to do when multiple snippets are provided in a request.
		// Precidence : `id` > `_ids` > `filter` > `tags`
		if ( request.id !== undefined )
		{
			method_id( model, request.id )
		}
		else if ( request.ids !== undefined )
		{
			method_ids( model, request.ids )
		}
		else if ( request.filter !== undefined )
		{
			method_id( model, request.filter )
		}
		else if ( request.tags !== undefined )
		{
			method_tags( parse_tags( request ), request.tags )
		}
		else 
		{
			otherwise( model, request )
		}
	}
}


export function get_pallete( request : Request )
{

	return 

}
