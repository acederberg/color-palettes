const path = require('path');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


const SRC = path.join( __dirname, '..', 'src' )
const DIST = path.join(__dirname, '..', 'dist')
const PUBLIC = path.join( __dirname, '..', 'public' )

module.exports = (env) => {

  return {

    mode: 'development',
    entry: {
      reactRefreshSetup: '@pmmmwh/react-refresh-webpack-plugin/client/ReactRefreshEntry.js',
      main: path.join( SRC, 'index.tsx' ),
    },

    output: {
      filename: '[name].js',
      path: DIST,
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          include: SRC,
          use: 'babel-loader',
        },
        {
          test : /\.css$/,
          use : [
            'style-loader',
            'css-loader'
          ]
        },
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        filename: './index.html',
        template: path.join( PUBLIC, 'index.html' ),
      }),
    ],

    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx' ],
    },

  }

}


