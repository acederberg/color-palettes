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


export default function main() : Everything
{
	const app = create_app()
	create_routes( app )
	const db = create_db()
	console.log( db )
	return {
		app : app,
		db : db 
	}
}
