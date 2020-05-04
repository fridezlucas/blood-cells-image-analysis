const path = require('path');

module.exports = {
    entry: path.join(__dirname, '/app.ts'),
    output: {
        filename: 'app.js',
        path: __dirname
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    optimization: {
		// We no not want to minimize our code.
		minimize: false
	},
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
};