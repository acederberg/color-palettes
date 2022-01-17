import { useContext, useState } from 'react'
import { Pane } from 'evergreen-ui'

import { PalleteContext } from '../contexts'
import { CellProps } from './types'


const SIZES = { small : 32, medium : 64, large : 128 }


export function SubCell( props : CellProps)
{
	// Each cell is to be made of two halfs -
	// This is the base for the two halfs.
	
	const size = SIZES[ props.cellSize ]
	
	return <Pane 
		height = { size / 2 } 
		width = { size } 
		color = { props.cellColor }
		children = { props.children }
	/>

}


export function CellTextBox({ cellColorName, isName })
{
	// Should attempt to update `PalleteContext.state.colors`.
	// The contexts value will use the 'handle_err' arguement to make this work.
	// Succesful setting should have the side effect that the state of the `Pallete` component is updated.
	// When cellColorName is changed 

	// Keep track of the current cell value when it changes.
	// Since onBlur cannot accept an event this is helpful.

	let colors = PalleteContext.state.colors
	const [ current_cell_value, set_current_cell_value ] = useState( isName ? cellColorName : PalleteContext.state.colors[ cellColorName ] )
	const pallete_context = useContext( PalleteContext )

	// Event handlers.
	// Blur and Enter should do the same thing.

	const onChange = ( event ) => { set_current_cell_value = event.target.value }

	const onBlur = !isName 
		? () => { colors[ cellColorName ] = event.target.value }
		: () => { 
			const value = colors[ cellColorName ]
			colors[ set_current_cell_value ] = value
		}

	const onKeydown = ( event ) => {
		if ( event.keyCode === 'Enter' ) onBlur()
	}

	return <SubCell>
		<TextInput { ...{ onKeyDown, onBlur, onChange } }/>
	</SubCell>

}

	/*
export function ColorCell({ cellSize, cellColor, cellColorName, children })
{
	// 

	const pallete_context = useContext( PalleteContext )
	const [ color_state, set_color_state ] = useState( pallete_context.state[ cellColorName ] )

	return <SubCell ...{ cellSize, cellColor }>
		<CellTextBox ...{ cellColorName }/>
	</SubCell>

}


export function ColorNameCell({ cellSize, children })
{
	return <SubCell ...{ cellSize, cellColor }>
		<CellTextBox ...{ cellColorName }/>
	</SubCell>
}
	 */


export default function Cell( props : CellProps )
{
	
	const pallete_fetcher = useContext( PalleteContext )

	return <Pane>
		

	</Pane>

}
