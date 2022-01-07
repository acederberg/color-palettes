import { ColorsModel } from '../models'
import { tags_fields_undefined } from './msg'
import { parse_tags } from './parsers'
import { Request } from './types'


// DECORATORS.

export function with_decide({ method_id, method_ids, method_filter, method_intersecting_tags, method_containing_tags, method_varients }, otherwise )
{
  return function ( model : ColorsModel, request : Request, ...args )
  {
    // Decides what to do when multiple snippets are provided in a request.
    // Unpack args in the middle since methods decorated with 'with_update' need it.
    // Precidence : `id` > `_ids` > `filter` > `tags`
    if ( request.id !== undefined )
    {
      return method_id( model, ...args, request.id )
    }
    else if ( request.ids !== undefined )
    {
      return method_ids( model, ...args, request.ids )
    }
    else if ( request.filter !== undefined )
    {
      return method_filter( model, ...args, request.filter )
    }
    else if ( request.tags !== undefined )
    {
      const parsed = parse_tags( request )
      if ( !parsed.tags || !parsed?.tags.items )
      {
        return tags_fields_undefined()
      }
      const result = parsed.tags.containment
        ? method_containing_tags( model, ...args, parsed.tags.items )
        : method_intersecting_tags( model, ...args, parsed.tags.items )
      return result
    }
    else if ( request.varients !== undefined )
    {
      return method_varients( model, request )
    }
    else
    {
      return otherwise( model, request )
    }
  }
}
