module.exports = {
  parser : '@typescript-exlint/parser',
  parserOptions : {
    emcaVersion : 2021, // What should this javascript look like, what are the available features
    sourceType : 'module' // Allow import statements ( not 'requires' )
  },
  extends : [
    // These should have been installed with 'npm' or 'yarn'
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    // Prettier
    'prettier',
    'plugin:prettier.recommended'
  ],
  rules : {
    // Many of these should already be prevented by the tsconfig, but is here just incase that setting is changed.
    'no-unused-vars' : 'warn', 
    '@typescript-eslint/no-unused-vars' : [ 'error' ], 
    '@typescript-eslint/no-var-requires' : 'warn',
    'react/prop-types' : 'warn',
    'react/jsx-uses-react' : 'off', // Do not need to import react
    'react/react-in-jsx-scope' : 'off',
    '@typescript-eslint/explicit-module-boundary-types' :'off'
  },
  settings : {
    react : {
      version : 'detect'
    }
  }
}
