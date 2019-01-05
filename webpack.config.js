const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');


module.exports = (env) => {
    const devMode = env !== 'prod';
    let config = {};
    if (devMode) {
        config.devtool = 'inline-source-map';
    } else {
        config.optimization = {
            minimizer: [
                new TerserPlugin(),
                new OptimizeCSSAssetsPlugin()
            ]
        }
    }
    config = {
        ...config,
        entry: {
            main: './src/index.js'
        },
        output: {
            path: path.resolve(__dirname, './dist'),
            filename: '[name].[chunkhash].js'
        },

        module: {
            rules: [{
                    test: /\.tag\.html$/,
                    exclude: /node_modules/,
                    loader: 'riot-tag-loader',
                    query: {
                        type: 'es6',
                        hot: true
                    }
                }, {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                },
                {
                    test: /\.css$/,
                    use: [{
                            loader: MiniCssExtractPlugin.loader
                        },
                        {
                            loader: 'css-loader',
                        }
                    ]
                },
                {
                    test: /\.(sass|scss)$/,
                    use: [{
                            loader: MiniCssExtractPlugin.loader
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: true
                            }
                        },
                        {
                            loader: 'postcss-loader',
                        },
                        {
                            loader: 'sass-loader'
                        }
                    ]
                },
            ]
        },
        plugins: [
            new CleanWebpackPlugin(path.resolve(__dirname, './dist'), {
                root: process.cwd()
            }),
            new MiniCssExtractPlugin({
                filename: 'style.[contenthash].css'
            }),
            new HtmlWebpackPlugin({
                inject: false,
                hash: true,
                template: './src/index.html',
                filename: 'index.html'
            }),
            new WebpackMd5Hash()
        ]
    }
    return config;
};
