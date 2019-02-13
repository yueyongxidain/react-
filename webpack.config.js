const webpack = require('webpack');
const glob = require('glob');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const webpackConfig = {
    entry: {},   //入口文件
    output: {
        path: path.resolve(__dirname, './dist/'),  //输出位置
        filename: '[name].[chunkhash:12].js'    //输出文件
    },
    //设置开发者工具的端口号,不设置则默认为8080端口
    devServer: {
        inline: true,
        hot: true,
        port: 8181
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.(scss|sass|css)$/,
                loader: ExtractTextPlugin.extract({ fallback: "style-loader", use: "css-loader" })
            },

        ]
    },
    plugins: [
        new ExtractTextPlugin("[name].[chunkhash:12].css"),
        new CleanWebpackPlugin(
            ['dist'],
            {
                root: __dirname,
                verbose: true,
                dry: false
            }
        )
    ],
};
// 获取指定路径下的入口文件
function getEntries(globPath) {
    const files = glob.sync(globPath),
        entries = {};
    files.forEach(function (filepath) {
        const split = filepath.split('/');
        const name = split[split.length - 2];
        entries[name] = './' + filepath;
    });
    return entries;
}

const entries = getEntries('src/**/index.js');

Object.keys(entries).forEach(function (name) {
    webpackConfig.entry[name] = entries[name];
    const plugin = new HtmlWebpackPlugin({
        filename: name + '.html',
        template: './public/index.html',
        inject: true,
        chunks: [name]
    });
    webpackConfig.plugins.push(plugin);
})

module.exports = webpackConfig;