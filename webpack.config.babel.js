/* eslint-disable import/no-extraneous-dependencies */
import path from 'path'
import webpack from 'webpack'
import packageConfig from './package.json'

export default {
  entry: path.resolve(__dirname, 'src', path.basename(packageConfig.browser)),
  output: {
    path: path.resolve(__dirname, path.dirname(packageConfig.browser)),
    filename: path.basename(packageConfig.browser),
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
  ],
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loaders: ['babel'] },
    ],
  },
}
