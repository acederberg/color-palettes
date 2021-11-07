import queries from './queries'
import { ColorsSafe, ColorsModel, ColorsDocument, ColorsAndId, Msg } from './types'
import validate from './validate'

type ManyColors = ColorsAndId | Promise<ColorsDocument[] | ColorsDocument> | ColorsDocument[] | null;

// The sole creator.
async function create_new( model : ColorsModel, raw : ColorsSafe ) : Promise<ColorsDocument[] | ColorsDocument | Msg | boolean>
{
	// Turn a raw request into a database object.
	const validated = validate( raw )
	if ( validated !== true ){ return validated }
	console.log( 'model=', model )
	const args = {
		colors : raw.colors,
		metadata : {
			created : new Date(),
			description : raw.metadata.description,
			modified : [],
			name : raw.metadata.name,
			tags : raw.metadata.tags,
			varients : []
		}
	}
	console.log( 'args=', args )
	const new_model = new model( args )
	const err = await new_model.save().catch( ( err ) => { msg : err } )
	console.log( 'new_model=', new_model )
	return err ? err : new_model
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
