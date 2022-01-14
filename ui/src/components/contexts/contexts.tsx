import { Context } from 'react'

// Local imports
import { GlobalState } from './objects'

// Fetcher imports
import { getCollectionFetchers, CollectionFetcher, PalleteFetcher } from '../../../api/src/fetchers'


// Contexts.
// - `GlobalContext` -- Decides view mode, one of 'collections', 'collection', or 'pallete'.
// - `CollectionState` -- Decides which collection and what of it to show in the 'collection' view mode. Holds a CollectionFetcher.
// - `PalleteState` -- Decides which pallete is shown and holds a `PalleteFetcher`.

const GlobalContext = React.createConext 
const CollectionsContext = React.createContext( getCollectionFetchers() )
const CollectionContext = React.createContext( new CollectionContext() )
const PalleteContext = React.createContext( new PalleteContext() )


export function GlobalContextProvider({ children, initGlobalContext })
{
	return <GlobalContext.provider value = { initGlobalContext }>
		{ children }
	</GlobalContext.provider>
}


export function CollectionConextProvider({ children, collectionsFetcher })
{
	return <CollectionContext.Provider value = { collectionsFetcher }>
		{ children }
	</CollectionContext.Provider>
}


export function CollectionsContextProvider({ children, collectionFetcher })
{
	return <CollectionContext.Provider value = { collectionFetcher }>
		{ children }
	</CollectionContext.Provider>
	
}


export function PalleteContextProvider({ children, palleteFetcher })
{
	return <PalleteContext.Provider value = { palleteFetcher }>
		{ children }
	</PalleteContext.Provider>
}
