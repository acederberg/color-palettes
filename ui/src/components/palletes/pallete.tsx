import { Pane } from 'evergreen-ui'

import { PalleteContextProvider, PalleteFetcher } from '../contexts'
import { Cell } from './cell'


export default function Pallete({ palleteId, collectionName})
{

	// Uses `pallete_fetcher` context to share state with subordinate elements.
	const pallete_fetcher : PalleteFetcher = new PalleteFetcher(
		collectionName,
		palleteId,
		( err ) => alert( err )
	)

	return <PalleteContextProvider value = { pallete_fetcher }>
		<Pane>
			
		</Pane>
	</PalleteContextProvider>
}
