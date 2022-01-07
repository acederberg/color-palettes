import { Tags, Request } from '../controllers'


const DELIMETER = ','
const AMENDMENTS = 'updates'


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
    containment : queries?.containment && /true/i.test( queries.containment )
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


export function parse_out_args( request_body )
{
  if ( !request_body ) return []
  else if ( !request_body[ AMENDMENTS ] ) return [ request_body ]

	// Could mutate in place, but side effects aren't in line with current design.
	const result = { ...request_body }
	result[ AMENDMENTS ] = undefined
	
	// Unpacked into decorated methods in 'with_route'
	// Thus arguement order is essential
	return [ 
    result,
		request_body[ AMENDMENTS ],
	].filter( Boolean )

}
