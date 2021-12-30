import queries from './queries'
import { ColorsSafe, ColorsModel, ColorsDocument, ColorsAndId, Msg, ObjectId } from './types'
import validate from './validate'
import mongoose from 'mongoose'

// NB : Most of the exports are decorated functions contained in the exports section.
export const NO_SUCH_TARGET = "The specified target does not exist."
export const CREATE_VARIENTS_PUSHER = ( some_id ) => { return {
	'$push' : {
		'metadata.varients' :	some_id
	}
}}
	

 
type ManyColors = ColorsAndId | Promise<ColorsDocument[] | ColorsDocument> | ColorsDocument[] | null;


// DECORATORS ----------------------------------------------------------------------------/

// For the get methods.
export function with_exec( method : Function ) : Function
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
	console.log( err )
	return err
}


function to_raw( not_raw : ColorsAndId ) : ColorsSafe
{
	return {
		colors : not_raw.colors || {},
		metadata : not_raw.metadata
	}
}


async function create_new_from_existing_by_id( origin : ColorsModel, target : ColorsModel, _id : ObjectId, amendments : Object )
{

	// Find original
	const original = await origin.findById( _id )
	if ( !original ) return { msg : NO_SUCH_TARGET } 

	// Make target using original and applying the amendments
	const initialized = await create_new( target, to_raw( original ) )
	await target.findByIdAndUpdate( initialized, amendments ).exec()

	// UPDATES
	// Update the varients sections.
	await link_as_varients( 
		origin, target, 
		original[ '_id' ], initialized[ '_id' ]
	)
	return target.findById( initialized[ '_id' ] ).exec()

}


// READ METHODS ----------------------------------------------------------------------------/ 


// UPDATE METHODS ----------------------------------------------------------------------------/ 


export async function link_as_varients( origin : ColorsModel, target : ColorsModel, origin_id : ObjectId, target_id : ObjectId )
{
	await origin.findByIdAndUpdate( 
		origin_id, 
		CREATE_VARIENTS_PUSHER( target_id ) 
	).exec().then( console.log )
	
	await target.findByIdAndUpdate( 
		target_id, 
		CREATE_VARIENTS_PUSHER( origin_id ) 
	).exec().then( console.log )
}


// DELETE METHODS ----------------------------------------------------------------------------/ 


const static_methods = {
	readers : {
		read_all : with_exec( queries.all_ ),
		read_containing_tags : with_exec( queries.containing_tags ),
		read_filter : with_exec( queries.filter ),
		read_ids : with_exec( queries.ids ),
		read_id : with_exec( queries.ids ),
		read_intersecting_tags : with_exec( queries.intersecting_tags ),
		read_varients : with_exec( queries.varients ),
	},
	creators : {
		create_new,
		create_new_from_existing_by_id,
		//create_new_from_existing 
	},
	deleters : {
		delete_all : with_delete( queries.all_ ),
		delete_id : with_delete( queries.id ),
		delete_ids : with_delete( queries.ids ),
		delete_varients : with_delete( queries.varients )
	},
	updaters : {
		update_all : with_update( queries.all_ ),
    update_containing_tags : with_update( queries.containing_tags ),
		update_filter : with_update( queries.filter ),
		update_id : with_update( queries.id ),
		update_ids : with_update( queries.ids ),
		update_intersecting_tags : with_update( queries.intersecting_tags ),
		update_varients : with_update( queries.varients )
	}
}
export default static_methods

