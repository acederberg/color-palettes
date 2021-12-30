import create_everything from "./app"


export async function main()
{

	const { app } = await create_everything()
	const port : number = Number( process.env.PORT ) || 8000

	app.listen(
			port,
			() => console.log( `Listening on ${ port }.` )
	)

}
