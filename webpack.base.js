const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const F = require('friendly-errors-webpack-plugin');
const glob = require('glob');
const env = process.env.NODE_ENV;
const setMPA = () => {
    let entry = {};
    const entryFiels = glob.sync(path.join(__dirname, './src/*/index.{js,tsx,ts}'));
    let plugins = entryFiels.map(v => {
        const result = v.match(/src\/([^\/]+)\/index\.[jt]sx?$/);
        entry[result[1]] = './' + result[0];
        return new HtmlWebpackPlugin({
            template: path.join(__dirname, `src/${result[1]}/index.html`),
            filename: `${result[1]}.html`,
            chunks: [result[1], 'vendor'],
            inject: true,
            minify: {
                html5: true,
                removeComments: true
            }
        })
    });
    
    return {
        entry,
        plugins
    }
}

const {entry, plugins} = setMPA();

console.log('entry', entry);
module.exports = {
    entry: entry,
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name]_[chunkhash:8].js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    "babel-loader",
                    "eslint-loader"
                ]
            },
            {
                test:/(jpg|png|jpeg|svg|gif|woff2?|tff|off)$/,
                use: [{
                    loader:"file-loader",
                    options: {
                        name: '[name]_[hash:8][ext]'
                    }
                }]
            },
            {
                test: /\.tsx?$/,
                use: "awesome-typescript-loader"
            },
            {
                test: /\.s?css$/,
                use: [
                    env === 'production' ? {
                        loader: MiniCssExtractPlugin.loader
                    } : 'style-loader',
                    "css-loader",

                    {loader: 'px2rem-loader', options: { //注意顺序
                        remUnit: 75,
                        remPrecision: 8,
                    }},
                    "sass-loader",
                    
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                require('autoprefixer')({
                                    browsers: ['last 2 version', '>1%', 'ios 7']
                                })
                            ]
                          }
                    }
                ]
            },    
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
          ...plugins,
          new MiniCssExtractPlugin(),
          new F()
    ]
}