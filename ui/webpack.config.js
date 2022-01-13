const { merge } = require( 'webpack-merge' )
const path = require( 'path' )

const commonConfig = require( './webpack/webpack.common.js' )


const ENV_ACCEPTABLE = [ 'prod', 'dev' ]
const ENV_REQUIRED = "Environment must be spcified using the '--env' flag."
const ENV_UNACCEPTABLE = `Environment must be one of the following: ${ ENV_ACCEPTABLE.join( ', ' ) }`


module.exports = ({ env }) => {


  if ( env == null ) throw Error( ENV_REQUIRED )
  else if ( !ENV_ACCEPTABLE.includes( env ) ) throw Error( ENV_UNACCEPTABLE )
  else console.log( `Using ${env} configuration.` ) 

  envConfig = require(
    path.join(
      __dirname,
      'webpack',
      `webpack.${env}.js`
    )    
  )

  return merge(
    commonConfig( env ),
    envConfig
  )

}
