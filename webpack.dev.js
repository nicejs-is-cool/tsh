const path = require('path');
const webpack = require('webpack')

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
        util: require.resolve('util/'),
        path: require.resolve('path-browserify')
    },
    alias: {
        readline: require.resolve('./src/readline/readline.js'),
        fs: require.resolve('./src/fs.ts')
    }
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'module'
  },
  plugins: [
    new webpack.ProvidePlugin({
        process: 'process/browser'
    }),
    new webpack.ProgressPlugin()
  ],
  experiments: {
    outputModule: true
  },
  devtool: 'inline-source-map',
  mode: "development",
};
