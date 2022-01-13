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

