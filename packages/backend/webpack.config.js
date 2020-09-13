const path = require('path');
const webpack = require("webpack");
const WebpackShellPlugin = require('webpack-shell-plugin');
const nodeExternals = require('webpack-node-externals');

const {
    NODE_ENV = 'production',
} = process.env;

module.exports = {
    entry: ["./app/app.ts"],
    mode: NODE_ENV,
    target: 'node',
    watch: NODE_ENV === 'development',
    externals: [
        nodeExternals()
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.js'
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'app/'),
            '@api': path.resolve(__dirname, 'app/controllers/api/'),
            '@config': path.resolve(__dirname, 'app/config/'),
            '@controllers': path.resolve(__dirname, 'app/controllers/'),
            '@helper': path.resolve(__dirname, 'app/controllers/helper/'),
            '@middleware': path.resolve(__dirname, 'app/controllers/middleware/'),
            '@models': path.resolve(__dirname, 'app/models/'),
            '@routes': path.resolve(__dirname, 'app/routes/'),
        },

        extensions: [".tsx", ".ts", ".js"]
    },

    plugins: [
        new WebpackShellPlugin({
            onBuildEnd: ['yarn run']
        }),
        // new webpack.HotModuleReplacementPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    'ts-loader'
                ],
                exclude: /node_modules/
            }
        ]
    }
}