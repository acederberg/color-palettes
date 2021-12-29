import main from "./app"

const { app } = main()

const port : number = Number( process.env.PORT ) || 8000

app.listen(
		port,
		() => console.log( `Listening on ${ port }.` )
)
