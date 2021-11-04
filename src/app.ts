import create_app from './server'
import create_db from './db'


export default function main(){
	
	const app = create_app()
	const db = create_db()
	return {
		app : app,
		db : db 
	}

}
