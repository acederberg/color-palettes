import { Message } from './components'


const APP_MESSAGE_NAME : String = "React+Typescript+Webpack Boilerplate"
const APP_MESSAGE : String = "It works!"


export default function App()
{
	return <Message 
		msg = { APP_MESSAGE } 
		msg_name = { APP_MESSAGE_NAME } 
		text_color = '#338aff'
	/>
}
