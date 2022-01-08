import { TAGS_REQUIRES_ITEMS } from './msg'
import { Request, RequestParsed } from './types'


export const TAGS_CONTAINMENT_VALUE : boolean = true


// PARSERS

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



