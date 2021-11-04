import queries from './queries'
import { ColorsSafe, ColorsModel, ColorsDocument, ColorsAndId } from './types'
import mongoose from 'mongoose'

type ManyColors = ColorsAndId | Promise<ColorsDocument[] | ColorsDocument> | ColorsDocument[] | null;

// The sole creator.
function create_new( model : ColorsModel, raw : ColorsSafe ) : ManyColors
{
	// Turn a raw request into a database object.
	const out = new model({
		colors : raw.colors,
		metadata : {
			created : new Date(),
			description : raw.metadata.description,
			modified : [],
			name : raw.metadata.name,
			tags : raw.metadata.tags,
			varients : raw.metadata.varients ? raw.metadata.varients.map( value => new mongoose.mongo.ObjectId( value ) ) : []
		}
	})
	out.save()
	return out
}


// For the get methods.
function with_exec( method : Function ) : Function
{
	return function ( model : ColorsModel, ...args ) : ManyColors
	{
		return method( model, ...args ).exec()
	}
}

// Update methods will have similar decorators but will additionally update the 'modified' field every time.
// Also, certian fields must not be  updatable, e.g. 'created' and 'modified'
export function with_update( method : Function ) : Function 
{
	return function ( model : ColorsModel, content : ColorsSafe, ...args ) : ManyColors
	{
		method( model, args ).update( content )
		return method( model, ...args ).exec()
	}
}


export default {
	readers : {
		read_all : with_exec( queries.all ),
		read_ids : with_exec( queries.ids ),
		read_intesecting_tags : with_exec( queries.intersecting_tags ),
		read_containing_tags : with_exec( queries.containing_tags ),
		read_filter : with_exec( queries.filter )
	},
	creators : {
		create_new : create_new
	}
}
