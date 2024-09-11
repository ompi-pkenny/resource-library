const { defineConfig } = require('@vue/cli-service');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production'
    ? '/resource-library/'
    : '/',
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new BundleAnalyzerPlugin(),
      new LodashModuleReplacementPlugin(),
    ],
  },
});