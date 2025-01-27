const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

const baseConfig = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'main.[hash].js',
    path: path.join(__dirname, '../build'),
    publicPath: '',
  },
  optimization: {
    minimizer: [new CssMinimizerPlugin()],
  },
  performance: {
    hints: false,
    maxEntrypointSize: 500000,
  },
  resolve: {
    modules: ['node_modules', path.resolve(__dirname, '../src')],
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.scss'],
  },
  module: {
    rules: [
      // style-loader conflict with MiniCssExtractPlugin.loader, only use one of them
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: true,
                localIdentName: '[path][name]__[local]--[hash:base64:5]',
              },
              sourceMap: true,
              importLoaders: 2,
            },
          },
        ],
      },
      // sass hasn't caught up with some of the latest css in mapboxgl.css so not using it on .css
      // order sass-loader -> css-loader -> MiniCssExtractPlugin.loader
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.(js|jsx)?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            ignore: ['./node_modules/mapbox-gl/dist/mapbox-gl.js'],
          },
        },
      },
      {
        test: /\.html$/,
        use: { loader: 'html-loader' },
      },
      {
        test: /\.(png|jpg|gif|svg|ico|eot|ttf|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'images/[name]-[hash:8].[ext]',
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: true,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css',
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './public/webviewer',
          to: './public/webviewer',
        },
      ],
    }),
  ],
};

module.exports = baseConfig;
