const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: ['./web/index.js', './web/styles.css', './web/react-native-web.css'],
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.web.tsx', '.web.ts', '.web.js', '.js', '.ts', '.tsx', '.json'],
    alias: {
      'react-native$': 'react-native-web',
      'react-native-safe-area-context': path.resolve(__dirname, '../src/platform/SafeAreaContext.web.js'),
      './platform': path.resolve(__dirname, '../src/platform/index.web.tsx'),
      // Alias para resolver módulos de React Navigation
      '@react-navigation/elements/lib/module/Header/MaskedView': path.resolve(__dirname, '../src/platform/MaskedView.web.js'),
      '@react-navigation/stack/lib/module/views/Stack/GestureHandler': path.resolve(__dirname, '../src/platform/GestureHandler.web.js'),
    },
    fallback: {
      'react-native-gesture-handler': false,
      'react-native-masked-view': false,
    },
    // Configuración para resolver módulos de React Navigation correctamente
    fullySpecified: false,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            configFile: path.resolve(__dirname, '../babel.config.web.js'),
          },
        },
      },
      // Regla específica para módulos de React Navigation
      {
        test: /\.(js|jsx)$/,
        include: /node_modules\/@react-navigation/,
        use: {
          loader: 'babel-loader',
          options: {
            configFile: path.resolve(__dirname, '../babel.config.web.js'),
          },
        },
      },
      {
        test: /\.css$/,
        exclude: /react-native-web\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  require('tailwindcss'),
                  require('autoprefixer'),
                ],
              },
            },
          },
        ],
      },
      {
        test: /react-native-web\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets/',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './web/index.html',
      filename: 'index.html',
    }),
    // Plugin para reemplazar módulos problemáticos de React Navigation
    new webpack.NormalModuleReplacementPlugin(
      /^\.\.\/MaskedView$/,
      path.resolve(__dirname, '../src/platform/MaskedView.web.js')
    ),
    new webpack.NormalModuleReplacementPlugin(
      /^\.\.\/GestureHandler$/,
      path.resolve(__dirname, '../src/platform/GestureHandler.web.js')
    ),
    new webpack.NormalModuleReplacementPlugin(
      /^\.\/useBackButton$/,
      path.resolve(__dirname, '../src/platform/useBackButton.web.js')
    ),
    new webpack.NormalModuleReplacementPlugin(
      /^\.\/useDocumentTitle$/,
      path.resolve(__dirname, '../src/platform/useDocumentTitle.web.js')
    ),
    new webpack.NormalModuleReplacementPlugin(
      /^\.\/useLinking$/,
      path.resolve(__dirname, '../src/platform/useLinking.web.js')
    ),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, '../dist'),
    },
    compress: true,
    port: 3000,
    hot: true,
    historyApiFallback: true,
    open: true,
  },
  devtool: 'source-map',
};
