const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	entry: "./src/index.ts",
	devtool: "inline-source-map",
	mode: "development",
	watch: true,
	devServer: {/*
		static: {
			directory: path.join(__dirname, 'dist'),
		},*/
		client: {
			logging: "verbose",
			webSocketURL: 'ws://videopong.wcu.edu:80/ws',
		},
		compress: true,
		port: 4000,
		allowedHosts: [
			"videopong.wcu.edu"
		],
		hot: true,
		webSocketServer: 'sockjs',
	},
	watchOptions: {
		aggregateTimeout: 300,
		poll: 1000
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
			{
				test: /\.css$/i,
				use: [MiniCssExtractPlugin.loader, "css-loader"],
				exclude: /node_modules/,
			},
			{ test: /\.html$/, loader: 'html-loader' }
		],
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
	},
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "dist"),
	},
	plugins: [new HtmlWebpackPlugin({
		template: "src/index.html"
	}), new MiniCssExtractPlugin({ filename: "link.css" },)],
}
