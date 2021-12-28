import { ColorsSafe } from '../models'


export type StringArray = Array<string>


export interface Tags
{

	items ?: Array<string> ;
	containment ?: boolean ;

}


export interface Request
{

	collection : string ;
	limit ?: number ;
	id ?: string ;
	ids ?: Array<string> ;
	filter ?: any ;
	tags ?: Tags | Array<string> ;

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
