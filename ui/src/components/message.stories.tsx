import '../fast-refresh-fix'
import Message from './message'


export default {
	component : 'name',
	component : Message
}


export function ThisIsATest(){ return <Message 
	msg_name = 'This is a Test'
	msg = 'This is a continuation of the test.'
	text_color = 'black'
/> }


export function ThisIsAWarning(){ return <Message
	msg_name = 'This is a Warning'
	msg = 'This is a continuation of the warning'
	text_color = 'red'
/> }

