const ArcGISPlugin = require('@arcgis/webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const path = require('path')
const webpack = require('webpack')

module.exports = function(_, arg) {
  const config = {
    entry: {
      index: ['@dojo/framework/shim/Promise', './src/worker-config.ts', './src/index.tsx'],
    },
    output: {
      filename: 'bundle.js',
      publicPath: '/static/',
      libraryTarget: 'var',
    },
    // Enable sourcemaps for debugging webpack's output.
    devtool: 'source-map',
    optimization: {
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: false,
        }),
      ],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(arg.mode || 'production'),
      }),

      new CleanWebpackPlugin(['dist']),

      new ArcGISPlugin({
        useDefaultAssetLoaders: false,
        exclude3D: true,
        locales: ['en'],
      }),
    ],
    resolve: {
      modules: [path.resolve(__dirname, '/src'), path.resolve(__dirname, 'node_modules/')],
      extensions: ['.ts', '.tsx', '.js'],
    },
    node: {
      process: false,
      global: false,
      fs: 'empty',
    },
  }

  return config
}
