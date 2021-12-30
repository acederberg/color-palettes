import { Document, Model } from 'mongoose'
import mongoose from 'mongoose'


export type ObjectId = mongoose.Types.ObjectId;
export type ColorsAndId = ColorsDocument & { _id : any };
export type Query = mongoose.Query< ColorsAndId[], ColorsAndId, {}, ColorsDocument>


// Shape of user submittable metadata
export interface MetadataSafe
{
	description?: string;
	name?: string;
	tags?: string[];
	varients?: ObjectId[] ;
}


// Shape of user submittable data
export interface ColorsSafe
{
	colors : Object;
	metadata : MetadataSafe;
}


// Shape of metadata
// New fields are not to be input by the user.
export interface Metadata extends MetadataSafe
{
	modified : Date[];
	created : Date;	
}


// Shape of data
export interface Colors extends ColorsSafe
{
	colors : Object;
	metadata : Metadata;
}

// The real deal.
// These types will have their constructors in `models`.
export interface ColorsDocument extends Colors, Document{};
export interface ColorsModel extends Model<ColorsDocument>{};

// Validation
export interface Msg
{
	msg : ( string | boolean )[]
}
