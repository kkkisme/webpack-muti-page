const path = require('path')
const fs = require('fs')

const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')

const modules = fs.readdirSync(path.resolve(__dirname,'../src/modules'))

const getEntry = () => {
  const entry = {}
  modules.forEach(m => {
    entry[m] = path.resolve(__dirname, '../src/modules', m, 'main.js')
  })

  return entry
}

const entry = getEntry()
const htmlPlugins = []
const templates = {}
const HtmlTemplates = () => {
  modules.forEach(m => {
    templates[m] = path.resolve(__dirname, '../src/modules', m, `${m}.html`)
  })

  for(let key in templates) {
    const options = {
      filename: `${key}/${key}.html`,
      template: templates[key],
      inject: true
    }
    if (entry.hasOwnProperty(key)) {
      options['chunks'] = [key]
    } else {
      options['chunks'] = []
    }

    htmlPlugins.push(new HtmlWebpackPlugin(options))
  }
}
HtmlTemplates()
module.exports = {
  mode: 'production',
  entry,
  output: {
    filename: '[name]/js/[name].js',
    path: path.resolve(__dirname, '../dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          }
          ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name]/css/[name].css",
    }),
    ...htmlPlugins
  ]
}
