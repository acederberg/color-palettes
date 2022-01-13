import { ColorsSafe, VarientsMethods } from '../models'


export type StringArray = string[]


export interface Tags
{

	items ?: string[] ;
	containment ?: boolean ;

}


export interface Request
{
	all ?: string ;
	collection ?: string ;
	limit ?: number ;
	id ?: string ;
	ids ?: string[] ;
	filter ?: any ;
	tags ?: Tags | string[] ;
	updates ?: any;
	varients ?: string[] ;

}


export interface CreateRequest
{
	// From existing
	origin ?: string ;
	origin_id ?: any ;
	amendments ?: any ;

	// New
	content ?: ColorsSafe ;

}


export interface VarientsRequest
{
	id : string
}


export interface RequestParsed extends Request
{
	tags ?: Tags
}


export interface Msg
{
	msg : string | string[]
}


export interface LinkRequest
{
	method : VarientsMethods
	origin : string
	origin_id : string
	target ?: string
	target_id : string
}
