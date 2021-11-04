import mongoose, { Schema } from "mongoose"

const metadata_schema_args = {
	created : {
		type : Date,
		required : true
	},
	desctiption : String,
	modified : {
		type : [ Date ],
		required : true
	},
	tags : [ String ],
	varients : mongoose.Schema.Types.ObjectId
}

export const colors_schema = new Schema( {
	_id : mongoose.Schema.Types.ObjectId,
	colors : {
		type : Object,
		required : true
	},
	metadata : {
		type : metadata_schema_args,
		required : true
	}
} )
