// From the markdowns boilerplate.
import mongoose from 'mongoose'

let connection : mongoose.Connection ;

export default function create_db() : mongoose.Connection 
{
	if ( !process.env.DB_URI ){ 
		throw Error( `DB_URI=${ process.env.DB } if false-y.` )
	}
	mongoose.connect( process.env.DB_URI )     
	return connection 
}

export async function listCollections() : Promise<String[]> 
{
	const collections = await connection.db.listCollections().toArray()
	return collections.map( item => item.name )
}

