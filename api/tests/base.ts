import mongoose from 'mongoose'

import { create_model_for_user, static_methods, ColorsModel, MetadataSafe, ColorsSafe } from '../src/models'


// Various constants.


export const DATABASE_URI = process.env.DB_URI || 'mongodb://mongodb:27017/test?connectTimeoutMS=10000'
export const TAGS = [ 'look', 'these', 'are', 'more', 'tests' ]

export const tests : ColorsModel = create_model_for_user( "tests" ) ;
export const more_tests : ColorsModel = create_model_for_user( "more_tests" )


export const metadata_defaults : MetadataSafe = {
  description : '',
  name : '',
  tags : [],
  varients : []
}



// Functions for creating data.


export const create_data = index => static_methods.creators.create_new(
  tests,
  create_dummy_from_integer( index )
)


export function create_dummy_from_integer( index ) : ColorsSafe
{
  return {
    colors : {},
    metadata : {
      name : `name${index}`,
      description : `This is the ${index}rd description`,
      tags : TAGS.slice( 0, index )
    }
  }
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


// Setup and teardown.


export async function setUp()
{
  await mongoose.connect( DATABASE_URI ).catch( err => { throw err })
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


