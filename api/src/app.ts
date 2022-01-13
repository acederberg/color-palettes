import { Express } from 'express'
//import { Connection } from 'mongoose'

import create_app from './server'
import { create_routes } from './views'
import create_db from './db'


interface Everything
{
	app : Express,
	db : any
}


export default async function main() : Promise<Everything>
{

	const app = await create_app()
	const db = await create_db()
	create_routes( app )

	return {
		app : app,
		db : db 
	}
}
