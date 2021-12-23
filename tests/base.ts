import { ColorsModel, MetadataSafe } from '../src/models/types'
import { create_model_for_user } from '../src/models'

const metadata_defaults : MetadataSafe = {
        description : '',
        name : '',
        tags : [],
        varients : []
}
export function create_dummy( metadata : Object ){ return {
        colors : { it : '#ffffff', was : '#ffffff', a : '#ffffff', test : '#ffffff' },
        metadata : { ...metadata_defaults, ...metadata }
}}
export function create_colors_dummy( colors : Object ){ return {
        colors : colors,
        metadata : metadata_defaults
}}

export const tests : ColorsModel = create_model_for_user( "tester" ) ;
