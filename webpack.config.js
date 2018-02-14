const objectRestSpread = require('@babel/plugin-proposal-object-rest-spread')
const path = require('path')
const webpack = require('webpack')
const packageConfig = require('./package.json')

const banner = `${packageConfig.name} ${packageConfig.version}
${packageConfig.repository.url}

Includes htmlparser2
https://github.com/fb55/htmlparser2/
https://github.com/fb55/htmlparser2/raw/master/LICENSE

@license ${packageConfig.license}
${packageConfig.repository.url}/raw/master/LICENSE`

const basename = path.basename(packageConfig.main, '.js')
const browsers = ['> 1%', 'last 2 versions', 'Firefox ESR', 'IE >= 9']

exports.default = {
  entry: {
    [basename]: './entry.js',
    [`${basename}.min`]: './entry.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  plugins: [
    new webpack.BannerPlugin(banner),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.UglifyJsPlugin({ include: /\.min\.js($|\?)/i }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: [
            [
              '@babel/preset-env',
              { modules: false, targets: { browsers }, useBuiltIns: 'usage' },
            ],
          ],
          plugins: [[objectRestSpread, { useBuiltIns: true }]],
        },
      },
    ],
  },
}
