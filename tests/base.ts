import mongoose from 'mongoose'

import { create_model_for_user, static_methods, ColorsModel, MetadataSafe } from '../src/models'


export const database_uri = process.env.DB_URI || 'mongodb://mongodb:27017/test?connectTimeoutMS=10000'
export const TAGS = [ 'look', 'these', 'are', 'more', 'tests' ]



export const metadata_defaults : MetadataSafe = {
  description : '',
  name : '',
  tags : [],
  varients : []
}


export const create_data = index => static_methods.creators.create_new(
    tests,
    {
      colors : {},
      metadata : {
        name : `name${index}`,
        description : `This is the ${index}rd description`,
        tags : TAGS.slice( 0, index )
      }
    }
  )


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


export const tests : ColorsModel = create_model_for_user( "tests" ) ;
export const more_tests : ColorsModel = create_model_for_user( "more_tests" )


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


