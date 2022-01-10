import { Express } from 'express'

import create_everything from "./app"


export default async function main() : Express
{

	const { app } = await create_everything()
	const port : number = Number( process.env.PORT ) || 8000

	app.listen(
			port,
			() => console.log( `Listening on ${ port }.` )
	)

	return app

}

