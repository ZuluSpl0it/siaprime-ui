/**
 * Base webpack config used across other specific configs
 */

const path = require('path')

// const { dependencies: externals } = require('./app/package.json')

module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/,
        loader: [
          'style-loader',
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
              modifyVars: {
                'primary-color': '#1ED660',
                'link-color': '#1ED660',
                'font-family': `"Metropolis", -apple-system,"Helvetica Neue", Helvetica`
              }
            }
          }
        ] // compiles Less to CSS
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack']
      },
      {
        test: /\.(eot|ttf|woff|woff2|otf)$/,
        loader: 'url-loader'
      }
    ]
  },

  output: {
    path: path.join(__dirname, 'app'),
    filename: 'bundle.js',
    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: 'commonjs2'
  },

  // https://webpack.github.io/docs/configuration.html#resolve
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.json'],
    modules: [path.join(__dirname, 'app'), 'node_modules']
  }

  // externals: Object.keys(externals || {})
}
