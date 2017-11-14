module.exports = {
    entry:  __dirname + "/src/index.js",
    output: {
	path: __dirname + "/app/",
	publicPath: 'app/',
	filename: "bundle.js"
    },
    devServer: {
	inline: true,
	port: 8080
    },
    devtool: "source-map",
    module : {
	loaders : [
	    {
		test : /\.jsx?/,
		loader : 'babel-loader'
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
