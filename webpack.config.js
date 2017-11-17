module.exports = {
    entry:  __dirname + "/src/index.js",
    output: {
	path: __dirname + "/app/",
	publicPath: 'app/',
	filename: "bundle.js"
    },
    devServer: {
	host: '0.0.0.0',
        port: '8800',
        disableHostCheck: true
    },
    devtool: "source-map",
    module : {
	loaders : [
	    {
		test : /\.js?/,
		loader : 'babel-loader',
		exclude: '/node_modules/'
	    },
	    {
		test: /\.json$/,
		loader: 'json-loader'
	    },
	    {
		test: /\.rt$/,
		loader: "react-templates-loader?modules=amd"
	    },
	    {
		test: /\.less$/,
                loader: ["style-loader", "css-loader", "less-loader"]
            },
	    {
		test: /\.css$/,
                loader: ["style-loader", "css-loader"]
            }
        ]
    }
}
