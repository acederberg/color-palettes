import { useState } from 'react'

import { GlobalStateProvider, GlobalState, Pallete, Collection, Collections } from './components'


const GLOBAL_STATE = new GlobalState( 'collection' )  


export default function App()
{

	// Uses the global context to determine which components 
	// to render and the arguements to be passed to it.

	const [ mode, setMode ] = useState( 'collection' )
	GLOBAL_STATE.invokeGlobalStateUpdate = setMode

	return <GlobalStateProvider initValue = { GLOBAL_STATE }>
		{
			mode === 'collections'
			? <Collections/>
			: 
				mode === 'pallete' 
				? <Collection 
					collectionName = { GLOBAL_STATE.collectionName }
				/>
				: <Pallete 
					palleteId = { GLOBAL_STATE.palleteId } 
					palleteCollectionName = { GLOBAL_STATE.collectionName }
				/>
		}
	</GlobalStateProvider>

}
