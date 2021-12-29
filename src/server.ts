import express, { Express } from "express"


export default function create_app() : Express
{
	
	const app : Express = express()
	
	app.use( express.json() )

	return app

}
