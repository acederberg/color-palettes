import { Document, Model, ObjectId } from 'mongoose'

// Shape of metadata
export interface Metadata{
	modified : [ Date ],
	created : Date,	
	name : String,
	tags : [ String ],
	varients : [ ObjectId ]
}

// Shape of data
export interface Colors{
	colors : Object,
	metadata : Metadata
}

// The real deal.
// These types will have their constructors in `models`.
export interface ColorsDocument extends Colors, Document{};
export interface ColorsModel extends Model<ColorsDocument>{};
