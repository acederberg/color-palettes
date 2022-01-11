import { Express, Server } from 'express'

import create_everything from "./app"


export default async function main() : Promise<[ Express, Server ]>
{

	const { app } = await create_everything()
	const port : number = Number( process.env.PORT ) || 8000

	return [ 
		app, 
		app.listen(
			port,
			() => console.log( `Listening on ${ port }.` )
		)
	]

}

