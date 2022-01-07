import { model } from 'mongoose'
import { colors_schema } from './schemas'
import { ColorsDocument, ColorsModel } from './types'


// Each user will have a collection corresponsponding to a hash of their username.
// Each model will have the same type ( as substantiated by the compiler compiling the below
// thus the static methods will work on each of them.
// Alikeness will be determined by tags.
export function create_model_for_user( username : string ) : ColorsModel
{ 
	return model<ColorsDocument>( username, colors_schema ) 
}
