import { Express } from 'express'
import { Connection } from 'mongoose'

import create_app from './server'
import create_db from './db'


interface Everything
{
	app : Express,
	db : Connection
}

export default function main() : Everything
{
	
	const app = create_app()
	const db = create_db()
	return {
		app : app,
		db : db 
	}
}
