import { ColorsModel, ObjectId, Query } from './types'

export function filter( model : ColorsModel, filter : Object ) : Query
{
	// Look for exact matches.
	return model.find( filter )
}


export function ids( model : ColorsModel, _ids : ObjectId[] ) : Query
{
	// Look for _id in _ids
	return model.find( { _id : {
		$in : _ids			  
	} } )
}


export function id( model : ColorsModel, _id : ObjectId ) : Query
{
	return model.find({ _id : _id })
}


export function intersecting_tags( model : ColorsModel, tags : [ string ] ) : Query
{
	return model.find( { 
		'metadata.tags' : { "$in" : tags }
	} )
}


export function containing_tags( model : ColorsModel, tags : [ string ] ): Query
{
	// https://docs.mongodb.com/manual/reference/operator/query/all/
	// For some reason nested shapes don't work, thus why the dot is used.
	// I suspect this has to do with the metadata interface being used to specify the colors interface.
	if ( !tags ) return all_( model )
	return model.find( {
		'metadata.tags' : { $all : tags }
	} )
}


export function varients( model : ColorsModel, _id : ObjectId ) : Query
{
	// Provided an id, find a list of varients.
	const varients = model.findOne({ _id : _id }).then( result => result?.metadata.varients )
	return model.find(
		{
			_id : {
				'$any' : varients
			}
		}
	)
}


export function all_( model : ColorsModel ) : Query
{
	return model.find({})
}



export default { 
	all_, 
	containing_tags,
	filter, 
	id,
	ids, 
	intersecting_tags, 
	varients
}

