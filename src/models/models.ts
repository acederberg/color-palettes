import { model } from 'mongoose'
import { colors_schema } from './schemas'
import { ColorsDocument } from './types'

// Each use will have a collection.
// Alikeness will be determined by tags.
export function create_model_for_user( username : string ){ return model<ColorsDocument>( username, colors_schema ) }
