// From the markdowns boilerplate.
import mongoose from 'mongoose'

let connection : any

export default async function create_db() 
{
	console.log( `mongo url: ${process.env.DB_URI}` )
	if ( !process.env.DB_URI ){ 
		throw Error( `DB_URI=${ process.env.DB_URI } is false-y.` )
	}
	connection = await mongoose.connect( process.env.DB_URI )     
}


export async function listCollections() : Promise<String[]> 
{
	const collections = await connection.db.listCollections().toArray()
	return collections.map( item => item.name )
}


