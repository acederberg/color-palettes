import { CellTextBox, SubCell, default as Cell } from './cell'

export default {
	title : 'The `Cell` Components and its Constituants.',
	component : Cell
}

export function LargeRedSubCell(){
	
	return <SubCell cellSize = { "large" } color = { "#ff5555" }/>

}

export function SmallBlueSubCell(){

	return <SubCell cellSize = { "small" } color = { "#558aff" }/>

}
