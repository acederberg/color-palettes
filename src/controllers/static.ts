import { Msg, Request, RequestParsed } from './types'
import { ColorsModel } from '../models/types'
import static_methods from '../models/static'


const { readers/*, creators, deleters, updaters */} = static_methods
export const FIELDS = [ 'id', 'ids', 'filter', 'tags' ]
export const TAGS_REQUIRES_ITEMS = "Request including tags as an object must include a tags field and it must be an array."
export const TAGS_CONTAINMENT_VALUE : boolean = true
export const READERS_NO_UNDEFINED_FIELDS : string = "On of the following fields must be used: ${}."


export function parse_tags( request : Request ) : RequestParsed
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


export function with_decide({ method_id, method_ids, method_filter, method_intersecting_tags, method_containing_tags }, otherwise )
{
	return function ( model : ColorsModel, request : Request )
	{
		// Decides what to do when multiple snippets are provided in a request.
		// Precidence : `id` > `_ids` > `filter` > `tags`
		if ( request.id !== undefined )
		{
			return method_id( model, request.id )
		}
		else if ( request.ids !== undefined )
		{
			return method_ids( model, request.ids )
		}
		else if ( request.filter !== undefined )
		{
			return method_filter( model, request.filter )
		}
		else if ( request.tags !== undefined )
		{
			const parsed = parse_tags( request )
			return parsed.tags?.containment 
				? method_containing_tags( parsed, request.tags )
				: method_intersecting_tags( parsed, request.tags )
		}
		else 
		{
			return otherwise( model, request )
		}
	}
}


export function msg( msg_ : string ) : Function
{
	// Takes these arguements since such arguements will be passed down by the decorators.
	return function( model : ColorsModel, args : any ) : Msg
	{
		return { msg : msg_ }
	}
}


export const get_pallete = with_decide(
	{
		method_id : readers.read_id,
		method_ids : readers.read_ids,
		method_filter : readers.read_filter,
		method_containing_tags : readers.read_containing_tags,
		method_intersecting_tags : readers.read_intersecting_tags
	}, 
	msg( READERS_NO_UNDEFINED_FIELDS )  
)
