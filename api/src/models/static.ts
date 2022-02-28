import mongoose from 'mongoose'

import { with_update, with_delete, with_exec } from './decorators'
import { ColorsSafe, ColorsModel, ColorsAndId, Msg, ObjectId, VarientsMethods, Varient } from './types'
import { create_model_for_user } from './models'

import queries from './queries'
import validate from './validate'


// NB : Most of the exports are decorated functions contained in the exports section.
export const NO_SUCH_TARGET = "The specified target does not exist."
export const VARIENT_ALREADY_EXISTS = "The specified varient already exists."

// Varients pushers and pullers
export const PULL = '$pull'
export const PUSH = '$push'
export const CREATE_VARIENTS_MODIFIER = ( method : VarientsMethods, origin : ColorsModel, origin_id : ObjectId ) => { 
	const modifier = {}
	modifier[ method ] = {
		'metadata.varients' :	{
			origin_id,
			origin : origin.modelName
		}
	}
	return modifier
}


function parse_varient( model : ColorsModel, varient : any ) : Varient
{
	// Since strings have length and `instanceof` sucks.
	if ( varient.length )
	{
		return {
			origin_id : new mongoose.Types.ObjectId( varient as string ),
			origin : model.modelName
		}
	}
	else
	{
		return {
			origin_id : new mongoose.Types.ObjectId( varient.origin_id ),
			origin : varient.origin
		}
	}

}


// CREATE methods


export async function create_new( model : ColorsModel, raw : ColorsSafe, custom_id : any = undefined ) : Promise<Msg | void | boolean | ColorsAndId >
{
	// Turn a raw request into a database object.
	const validated = validate( raw )
	if ( validated !== true ){ return validated }
	const args = {
		_id : new mongoose.Types.ObjectId( custom_id ),
		colors : raw.colors,
		metadata : {
			created : new Date(),
			description : raw.metadata.description,
			modified : [],
			name : raw.metadata.name,
			tags : raw.metadata.tags,
			varients : raw.metadata.varients 
				? raw.metadata.varients.map(
					varient => parse_varient( model, varient )
				)
				: []
		}
	}
	const err = await model.create( args )
		.catch( err => { msg : err } ) 
	console.log( '@create_new::err', JSON.stringify( err, null, 1 ) )
	return err
}


function to_raw( not_raw : ColorsAndId ) : ColorsSafe
{
	return {
		colors : not_raw.colors || {},
		metadata : not_raw.metadata
	}
}


export async function create_new_from_existing_by_id( origin : ColorsModel, target : ColorsModel, _id : ObjectId, amendments : Object )
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
		PUSH,
		origin, target, 
		original[ '_id' ], initialized[ '_id' ]
	)
	return target.findById( initialized[ '_id' ] ).exec()

}


// READ METHODS ----------------------------------------------------------------------------/ 


// UPDATE METHODS ----------------------------------------------------------------------------/ 


export async function link_as_varient( method : VarientsMethods , origin : ColorsModel, target : ColorsModel, origin_id : ObjectId, target_id : ObjectId )
{
	// See if a varient is already defined
	// First find origin, if not found, return a msg
	// If something is found, check that the varients do not contain target_id
	const result : any = await origin.findById( origin_id )
	
	if ( !result ) return { msg : NO_SUCH_TARGET }

	const exists = result.metadata.varients
		.find( varient => varient.origin_id === target_id )

	return !exists ? origin.findByIdAndUpdate( 
		origin_id, 
		CREATE_VARIENTS_MODIFIER( method, target, target_id ) 
	).exec() : { msg : VARIENT_ALREADY_EXISTS }
}


export async function link_as_varients( method : VarientsMethods, origin : ColorsModel, target : ColorsModel, origin_id : ObjectId, target_id : ObjectId )
{

	// First linkage
	let result = await link_as_varient( method, origin, target, origin_id, target_id )
	if ( !result || result[ 'msg' ] ) return result
	
	// Second linkage
	result = await link_as_varient( method, target, origin, target_id, origin_id )
	if ( !result || result[ 'msg' ]  ) return result
	
	return 
}



export async function find_varients( model : ColorsModel, _id : ObjectId, callback : Function = result => result )
{
	const result = await model.findById({ _id : _id }).exec()
	if ( !result?.metadata?.varients ) return { msg : VARIENT_ALREADY_EXISTS }
	else
	{
		let varients : any[] = [] ;

		// Must use a for loop to let promises resolve before returning
		for ( const varient of result.metadata.varients )
		{
			await create_model_for_user( varient.origin )
				.findById( varient.origin_id ).exec()
				.then( _result => {
					varients.push( _result ) 
					callback( _result )
				})
		}

		return varients
	}
}


// DELETE METHODS ----------------------------------------------------------------------------/ 


// DECORATED

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
		delete_containing_tags : with_delete( queries.containing_tags ),
		delete_filter : with_delete( queries.filter ),
		delete_id : with_delete( queries.id ),
		delete_ids : with_delete( queries.ids ),
		delete_intersecting_tags : with_delete( queries.intersecting_tags ), 
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
	},
}

export default static_methods

