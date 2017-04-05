const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

exports.devServer = function(options) {
    return {
        devServer: {
            // Enable history API fallback so HTML5 History API based
            // routing works. This is a good default that will come
            // in handy in more complicated setups.
            historyApiFallback: true,
            compress: true,

            // Unlike the cli flag, this doesn't set
            // HotModuleReplacementPlugin!
            hot: true,
            inline: true,
            // proxy: {
            //     '/ihome-api/*': {
            //         target: 'http://192.168.1.11:80/',
            //         secure: false,
            //         bypass: function(req, res, proxyOptions) {
            //             // console.log(req);
            //             console.log(res);
            //             return '/index.html';
            //         }
            //     }
            // },

            // Display only errors to reduce the amount of output.
            // stats: 'errors-only',

            // Parse host and port from env to allow customization.
            //
            // If you use Vagrant or Cloud9, set
            // host: options.host || '0.0.0.0';
            //
            // 0.0.0.0 is available to all network devices
            // unlike default `localhost`.
            host: options.host, // Defaults to `localhost`
            port: options.port // Defaults to 8080
        },
        plugins: [
            // Enable multi-pass compilation for enhanced performance
            // in larger projects. Good default.
            new webpack.HotModuleReplacementPlugin({
                multiStep: true
            })
        ]
    };
}

exports.extractBundle = function(options) {
    const entry = {};
    entry[options.name] = options.entries;

    return {
        // Define an entry point needed for splitting.
        entry: entry,
        plugins: [
            // Extract bundle and manifest files. Manifest is
            // needed for reliable caching.
            new webpack.optimize.CommonsChunkPlugin({
                names: [options.name, 'manifest']
            })
        ]
    };
}

exports.setupCSS = function(paths) {
    return {
        module: {
            loaders: [{
                test: /\.css$/,
                loaders: ['style', 'css'],
                include: paths
            }]
        }
    };
}

exports.minify = function() {
    return {
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            })
        ]
    };
}

exports.html = function() {
    return {
        plugins: [
            new HtmlWebpackPlugin({
                filename: '../index.html',
                template: './src/index.html',
            })
        ]
    };
}

exports.clean = function(path) {
    return {
        plugins: [
            new CleanWebpackPlugin([path], {
                // Without `root` CleanWebpackPlugin won't point to our
                // project and will fail to work.
                root: process.cwd()
            })
        ]
    };
}
