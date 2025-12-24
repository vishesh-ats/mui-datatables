const webpack = require('webpack');
const ESLintPlugin = require('eslint-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    app: ['core-js/stable', 'regenerator-runtime/runtime', './examples/Router/index.js'],
  },
  stats: 'minimal',
  context: __dirname,
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devtool: 'source-map',
  devServer: {
    allowedHosts: 'all',
    host: 'localhost',
    hot: true,
    port: 5050,
    client: {
      logging: 'warn',
      overlay: true,
    },
    static: {
      directory: __dirname,
    },
  },
  resolve: {
    // Default Webpack 5 resolution is usually fine, but prioritizing main can help with some legacy CJS/ESM interop
    mainFields: ['browser', 'module', 'main'],
    fallback: {
      process: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new ESLintPlugin({
      extensions: ['js', 'jsx'],
      configType: 'eslintrc',
      overrideConfigFile: path.resolve(__dirname, '.eslintrc'),
    }),
  ],
};
