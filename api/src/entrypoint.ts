import app from './index'
import add_defaults from './models/add_defaults'

async function main()
{
	await app()
	add_defaults()
}


main()
