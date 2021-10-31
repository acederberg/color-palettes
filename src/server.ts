import express, { Express } from "express"

export default function(){
	
	const app : Express = express()
	// Define what is shown when bad routes are used.
	app.use( ( req, res, next )=>{
		const err = new Error( 'Not found' )
		return res.json({ msg : err.message })
	})
	// Listen on some port
	const port : Number | String = process.env.PORT || 8000
	app.listen( 
		   port, 
		   () => console.log( `Listening on ${ port }.` ) 
	)
	return app

}
