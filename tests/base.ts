import mongoose from 'mongoose'

import { ColorsModel, MetadataSafe } from '../src/models/types'
import { create_model_for_user } from '../src/models'


export const database_uri = process.env.DB_URI || 'mongodb://mongodb:27017/test'


export const metadata_defaults : MetadataSafe = {
  description : '',
  name : '',
  tags : [],
  varients : []
}


export function create_dummy( metadata : Object ){ 
  return {
    colors : { 
      it : '#ffffff', 
      is : '#ffffff', 
      a : '#ffffff', 
      test : '#ffffff' 
    },
    metadata : { 
      ...metadata_defaults, 
      ...metadata 
    }
  }
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
  console.log( 'setUp starting...' )
  await mongoose.connect( database_uri ).catch( err => { throw err })
  console.log( 'setUp complete!' )
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
