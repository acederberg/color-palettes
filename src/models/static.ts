import queries from './queries'
import { ColorsSafe, ColorsModel, ColorsDocument, ColorsAndId, Msg } from './types'
import validate from './validate'
import mongoose from 'mongoose'

// NB : Most of the exports are decorated functions contained in the exports section.

 
type ManyColors = ColorsAndId | Promise<ColorsDocument[] | ColorsDocument> | ColorsDocument[] | null;


// DECORATORS ----------------------------------------------------------------------------/

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
	return function ( model : ColorsModel, content : Object, ...args ) : Object
	{
		console.log( content, ...args )
		// Should limit keys in content.
		return (
			async () => {
				const now = await Date.now()
				/*const args = { 
				}*/
				await method( model, ...args )
					.update(
						{
							...content, 
							'$push' : { 
								'metadata.modified' : now 
							}
						} 
					)
					.exec()
				const result = await method( model, ...args ).exec()
				return result
			}
		)()
	}
}


export function with_delete( method : Function ) : Function
{
	return function ( model : ColorsModel, ...args ) : Object
	{
		// Find the documents in the collection corresponding to `model`, save them for return, and `delete` them.
		return (
			async result => {
				const results = await method( model, ...args ).exec()
				await method( model, ...args ).remove().exec()
				return results
			}
		)()
			
	}
}



// CREATE ----------------------------------------------------------------------------/

async function create_new( model : ColorsModel, raw : ColorsSafe ) : Promise<Msg | void | boolean | ColorsAndId >
{
	// Turn a raw request into a database object.
	const validated = validate( raw )
	if ( validated !== true ){ return validated }
	const args = {
		_id : new mongoose.Types.ObjectId(),
		colors : raw.colors,
		metadata : {
			created : new Date(),
			description : raw.metadata.description,
			modified : [],
			name : raw.metadata.name,
			tags : raw.metadata.tags,
			varients : raw.metadata.varients ? raw.metadata.varients : []
		}
	}
	const err = await model.create( args )
		.catch( err => { msg : err } ) 
	return err
}


async function create_new_from_existing( origin : ColorsModel, target : ColorsModel, filter : Object, ammendments : Object ) 
{
	// Take documents matching the filter in the 'origin' collection and
	// add them to the 'target' collection with ammendments applied.
	const results = await static_methods.readers.read_filter( origin, filter )
	return results.map(
		async ( result ) => {
			// Create new, add amendments.
			const initialized = await create_new( target, { ...result._doc, colors : {} } )
			const finalized = await target.findByIdAndUpdate( initialized[ '_id' ], ammendments ).exec()
			return finalized
		}
	)
}


// READ METHODS ----------------------------------------------------------------------------/ 


// UPDATE METHODS ----------------------------------------------------------------------------/ 


// DELETE METHODS ----------------------------------------------------------------------------/ 


const static_methods = {
	readers : {
		read_all : with_exec( queries.all_ ),
		read_ids : with_exec( queries.ids ),
		read_id : with_exec( queries.ids ),
		read_intersecting_tags : with_exec( queries.intersecting_tags ),
		read_containing_tags : with_exec( queries.containing_tags ),
		read_filter : with_exec( queries.filter )
	},
	creators : {
		create_new,
		create_new_from_existing 
	},
	deleters : {
		delete_all : with_delete( queries.all_ ),
		delete_id : with_delete( queries.id ),
		delete_ids : with_delete( queries.ids )
	},
	updaters : {
		update_all : with_update( queries.all_ ),
		update_id : with_update( queries.id ),
		update_ids : with_update( queries.ids ),
		update_filter : with_update( queries.filter ),
		update_intersecting_tags : with_update( queries.intersecting_tags ),
    update_containing_tags : with_update( queries.containing_tags )
	}
}
export default static_methods

