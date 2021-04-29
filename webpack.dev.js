const webpack = require('webpack');
const baseConfig = require('./webpack.base');
const path = require('path');
const { merge } = require("webpack-merge");
console.log(merge)
const devConfigs = {
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js'
    },
    mode: 'development',
    watch: true,
    watchOptions: {
        poll: 1000,
        aggregateTimeout: 1000,
        ignored: /node_modules/
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ],
    devServer: {
        contentBase: './dist',
        hot: true
    },
    devtool: 'source-map'
};

module.exports = merge(baseConfig, devConfigs);
