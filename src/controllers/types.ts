import { ColorsSafe } from '../models'


export type StringArray = string[]


export interface Tags
{

	items ?: string[] ;
	containment ?: boolean ;

}


export interface Request
{

	collection : string ;
	limit ?: number ;
	id ?: string ;
	ids ?: string[] ;
	filter ?: any ;
	tags ?: Tags | string[] ;

}


export interface CreateRequest
{
	// From existing
	origin ?: string ;
	origin_id : any ;
	amendments : any ;

	// New
	content ?: ColorsSafe ;

}


export interface RequestParsed extends Request
{
	tags ?: Tags
}


export interface Msg
{
	msg : string | string[]
}
