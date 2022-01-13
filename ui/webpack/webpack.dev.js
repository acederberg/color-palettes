module.exports = ( env ) => {

  return {

    devServer: {
      hot: true,
      port: 8080,
    },

    plugins : [
      new ReactRefreshPlugin()
    ],

    optimization: {
      runtimeChunk: 'single',
      // Ensure `react-refresh/runtime` is hoisted and shared
      // Could be replicated via a vendors chunk
      splitChunks: {
        chunks: 'all',
        name(_, __, cacheGroupKey) {
          return cacheGroupKey;
        },
      },
    }

  }

}
