import express, { Express } from "express"


function not_found( req, res, next )
{
	return res.json({ msg : 'The requested route does not exist.' })
}

export default function(){
	
	const app : Express = express()
	// Define what is shown when bad routes are used.
	app.use( not_found
	       )
	// Listen on some port
	const port : Number | String = process.env.PORT || 8000
	app.listen( 
		   port, 
		   () => console.log( `Listening on ${ port }.` ) 
	)
	return app

}
