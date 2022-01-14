# Color Picker UI

## Motivation

I decided to make this as an exercise but also because I could not find anything that fit the objestives stated above. In particular, I would like to be able to use template, make color palettes, and download them as JSON ( For instance for the windows terminal, posh, etc. ).


## Objectives

- Single page application to create, view, edit, and remove all palletes in a collection, individual palletes, and the collection of all collections of palletes.
- Configure both client-side and server-side validation using a common configuration ( this will be done in the pipeline ).
- Add to pallete either by manually entering color codes or by using a color selector.
- Name the colors in the palette.
- Make json obtainable through the front-end.
- Make new palletes from existing palettes.


## Implementation

This will use typescript and react since statefulness of components is important. There are objects to use as state included in the color picker API, but will be shared using context. Validation is built into these objects.



### Naming

- **Types, Interfaces, and Class Names** - Camel cased.
	- Example: `ThisIsAnExampleTBH`.
	- Props types and interfaces should be end in `Props`.
	- Enumerators should end in `Enum`.
- **Components** - Camel cased.
	- Example: `ThisIsAnotherExample`.
	- Props: Component property names should be lower-Camel-Cased. This keeps them from looking the same as functions
- **Functions** - Camel case with the leading character lowercase and abbreviations all caps.
	- Example: `thisIsAnExampleTBH`. 
	- This should include higher order components. 
	- This should apply to lambda functions and local functions in general, e.g. `useState` or `useContext`.
	- Naming for non-component functions will follow the 'verb-noun' style of naming. When such functions produce functions, it should be named like 'create-verb-noun'.
- **Variables in functions and classe members** - Such names should be lowercase and delimited with underscores.
- **Variables in modules** - ( aka Boomers yelp review format underscore delimited. )


## Components

### Cell

- Consumer of `GlobalContext` and `PalleteContext`.
- `Pane` of `evergreen-ui`.
- Contains either a name or a color code. 
- Color code cells should be able to bring up a color picker. 
- Clicking off should result in state change and possible validation error ( from `PalleteFetcher.state` ).


### Pallete

- Consumer of `GlobalContext` and `PalleteContext`.
- CRUD included via `PalleteFetchers`s.
- `Pane` from `evergreen-ui`
- A collection of `Cell`s.
- Ability to add or delete cells by nullifying either field.
- Ability to get `JSON`.
- ML completion?


### PalletePreview

- Consumer of `GlobalContext` and `CollectionContext`.
- Displays colors with no editing capability and no names. 
- Clicking should modify the global state to change the mode to `'pallete'` and set `GlobalState.palleteId`.


### Collection

- Consumer of `GlobalContext` and `CollectionContext`.
- CRUD included via `PalleteFetchers`s.
- Pagination of various `Pallete` previews. Read about pagination with `evergreen-ui` [here](https://evergreen.segment.com/components/pagination).
- Clicking on any `PalletePreview` should change the mode to `'pallete'` and set `GlobalState.collectionName`.


### Collections

- Consumer of `GlobalContext` and `CollectionsContext`.
- CRUD inlcuded via `CollectionFetcher`s.
- Pagination of various `CollectionPreviews`.
- Clicking on any `CollectionPreview` should change the mode to `'collection'`
- Roughly the same as the `Collection` component.
- No CRUD.


### ValidationError

- `Dailogue` from `evergreen-ui`.
- Renders validator error from the `Fetcher`s or the API.
- Exit button.


### JSONDialogue

- Consumer of `GlobalContext` and `PalleteContext`.
- View a pallete as `JSON`.
