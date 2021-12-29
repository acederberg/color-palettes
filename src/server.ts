import express, { Express } from "express"


export default function create_app() : Express
{
	
	const app : Express = express()
	const port : Number | String = process.env.PORT || 8000
	app.listen( 
		   port, 
		   () => console.log( `Listening on ${ port }.` ) 
	)
	return app

}
