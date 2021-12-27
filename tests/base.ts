import mongoose from 'mongoose'

import { create_model_for_user/*, static_methods */, ColorsModel, MetadataSafe } from '../src/models'


export const database_uri = process.env.DB_URI || 'mongodb://mongodb:27017/test?connectTimeoutMS=10000'


export const metadata_defaults : MetadataSafe = {
  description : '',
  name : '',
  tags : [],
  varients : []
}


export function create_dummy_with_colors( metadata : Object, color : string )
{ 
  return {
    colors : { 
      it : color, 
      is : color, 
      a : color, 
      test : color 
    },
    metadata : { 
      ...metadata_defaults, 
      ...metadata 
    }
  }
}


export function create_dummy( metadata : Object )
{
  return create_dummy_with_colors( metadata, '#fff' )
}


export function create_colors_dummy( colors : Object ){ 
  return {
    colors : colors,
    metadata : metadata_defaults
  }
}


export const tests : ColorsModel = create_model_for_user( "tester" ) ;


export async function setUp()
{
  await mongoose.connect( database_uri ).catch( err => { throw err })
}


export async function cleanUp()
{

  var _ids = await tests.find()
  _ids = await _ids.map( item => item._id )

  await tests.deleteMany(
    {
      _id : {
          $in : _ids
      }
    }
  )
  await mongoose.connection.close()

}


