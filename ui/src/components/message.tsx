
export interface MessageProperties
{
	text_color : String
	msg_name : String
	msg : String
}



export default function Message( props : MessageProperties )
{
	const { msg, msg_name, text_color } = props

	return <div style = {{ color : text_color }}>
		<h1>{ msg_name }</h1>
		<p>{ msg }</p>
	</div>
}
