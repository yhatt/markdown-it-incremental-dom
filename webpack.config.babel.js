/* eslint-disable import/no-extraneous-dependencies */
import path from 'path'
import webpack from 'webpack'
import packageConfig from './package.json'

export default {
  entry: './entry.js',
  output: {
    path: path.resolve(__dirname, path.dirname(packageConfig.browser)),
    filename: path.basename(packageConfig.browser),
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [['es2015', { modules: false }]],
        },
      },
    ],
  },
}
