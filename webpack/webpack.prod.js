const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = merge(common, {
    mode: 'production',
     performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    devtool: false
    // plugins: [new BundleAnalyzerPlugin()]
})
