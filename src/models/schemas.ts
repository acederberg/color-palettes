import mongoose, { Schema } from "mongoose"

const metadata_schema_args = {
	created : {
		type : Date,
		required : true
	},
	description : String,
	name : String,
	modified : {
		type : [ Date ],
		required : true
	},
	tags : [ String ],
	varients : [ String ]//mongoose.Schema.Types.ObjectId
}

export const colors_schema = new Schema( {
	_id : mongoose.Schema.Types.ObjectId,
	colors : {
		type : Object,
		required : true
	},
	metadata : metadata_schema_args
} )
