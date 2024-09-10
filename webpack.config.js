const { VueLoaderPlugin } = require('vue-loader');
const path = require('path');

module.exports = {
  // Entry point of your application
  entry: './src/main.js',

  // Output configuration
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },

  // Resolve .vue files and other extensions
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.runtime.esm-bundler.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },

  // Add module rules for Vue and other files
  module: {
    rules: [
      {
        test: /\.vue$/, // Add vue-loader for .vue files
        loader: 'vue-loader'
      },
      {
        test: /\.js$/, // Babel loader for JS files
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/, // CSS loaders
        use: ['style-loader', 'css-loader']
      }
    ]
  },

  // Add VueLoaderPlugin
  plugins: [
    new VueLoaderPlugin() // This is required to make vue-loader work
  ],

  // Set mode to development or production
  mode: 'development'
};