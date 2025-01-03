const { defineConfig } = require('@vue/cli-service');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

console.log('NODE_ENV', process.env.NODE_ENV);

module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production'
    ? 'https://staging4.lmrcimplementation.com/wp-content/themes/Divi/vue-app/'
    : '/',
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new LodashModuleReplacementPlugin(),
    ],
  },
});

console.log('module.exports', module.exports.publicPath);



