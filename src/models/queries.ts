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
export function intersecting_tags( model : ColorsModel, tags : [ String ] ) : Query
{
	return model.find( { 
		'metadata.tags' : { "$in" : tags }
	} )
}
export function containing_tags( model : ColorsModel, tags : [ String ] ): Query
{
	// https://docs.mongodb.com/manual/reference/operator/query/all/
	// For some reason nested shapes don't work, thus why the dot is used.
	// I suspect this has to do with the metadata interface being used to specify the colors interface.
	if ( !tags ) return all( model )
	return model.find( {
		'metadata.tags' : { $all : tags }
	} )
}
export function all( model : ColorsModel ) : Query
{
	return model.find()
}
export default { 
	all, 
	filter, 
	ids, 
	containing_tags,
	intersecting_tags, 
}

