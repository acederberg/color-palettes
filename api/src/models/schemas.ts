import mongoose, { Schema } from "mongoose"


const varient_schema = new Schema( {
	origin_id : mongoose.Schema.Types.ObjectId,
	origin : String
})


const metadata_schema = new Schema( {
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
	varients : [ varient_schema ]
})


export const colors_schema = new Schema( {
	_id : mongoose.Schema.Types.ObjectId,
	colors : Object,
	metadata : metadata_schema
})
