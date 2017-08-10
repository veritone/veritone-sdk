// const path = require('path');
const webpack = require('webpack');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

module.exports = {
	entry: './index.js',
	output: {
		filename: 'dist/bundle-browser.js'
	},
	plugins: [
		new webpack.DefinePlugin({
			__BROWSER__: process.env.BUILD_ENV === 'browser'
		}),
		new CaseSensitivePathsPlugin()
	],
	module: {
		noParse: /\.min\.js$/,
		rules: [
			// JavaScript / ES6
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			}
		]
	}
}
