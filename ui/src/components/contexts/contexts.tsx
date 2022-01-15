import { Context } from 'react'

// Local imports
import { GlobalState } from './objects'

// Fetcher imports
import { getCollectionFetchers, CollectionFetcher, PalleteFetcher } from '../../../api/src/fetchers'
export { getCollectionFetchers, CollectionFetcher, PalleteFetcher }


// Constants

const DEFAULTS_COLLECTION_NAME = "defaults"
const DEFAULTS_COLLECTION_ID = "000000000000000000000001" 
const DEFAULT_GLOBAL_CONTEXT_VALUE = new GlobalState() 
const DEFAULT_COLLECTIONS_CONTEXT_VALUE = new getCollectionFetchers() 
const DEFAULT_COLLECTION_CONTEXT_VALUE = new CollectionContext( DEFAULTS_COLLECTION_NAME ) 
const DEFAULT_PALLETE_CONTEXT_VALUE = new PalleteContext( DEFAULTS_COLLECTION_NAME, DEFAULTS_COLLECTION_ID ) 


// Contexts.

// - `GlobalContext` -- Decides view mode, one of 'collections', 'collection', or 'pallete'.
// - `CollectionState` -- Decides which collection and what of it to show in the 'collection' view mode. Holds a CollectionFetcher.
// - `PalleteState` -- Decides which pallete is shown and holds a `PalleteFetcher`.

const GlobalContext = createContext( DEFAULT_COLLECTIONS_CONTEXT_VALUE )
const CollectionsContext = createContext( DEFAULT_COLLECTIONS_CONTEXT_VALUE )
const CollectionContext = createContext( DEFAULT_COLLECTION_CONTEXT_VALUE )
const PalleteContext = createContext( DEFAULT_PALLETES_CONTEXT_VALUE )


// Providers of Context.

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
