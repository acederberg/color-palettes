import { TAGS_REQUIRES_ITEMS } from './msg'
import { LinkRequest, Request, RequestParsed } from './types'


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


import mongoose from 'mongoose'
import { create_model_for_user, ColorsModel, ObjectId } from '../models'


export function parse_link_request_to_args( request : LinkRequest ) : [ ColorsModel, ColorsModel, ObjectId, ObjectId ]
{
  // If only origin is specified, the the target is assumed to be the origin.
  const target = request.target || request.origin
  return [
    create_model_for_user( request.origin ),
    create_model_for_user( target ),
    new mongoose.Types.ObjectId( request.origin_id ),
    new mongoose.Types.ObjectId( request.target_id )
  ]
}
