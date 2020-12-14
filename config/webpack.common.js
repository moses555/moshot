const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const PrettierPlugin = require('prettier-webpack-plugin');

module.exports = {
  resolve: {
    modules: [path.resolve(__dirname, '../src'), 'node_modules']
  },
  entry: path.resolve(__dirname, '../src/index.js'),
  output: {
    filename: 'bundle.[chunkhash].js',
    path: path.resolve(__dirname, '../build'),
    publicPath: '/',
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: path.resolve(__dirname, '../public') }]
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/index.html'),
      minify: true,
    }),
    new ESLintPlugin({
      overrideConfigFile: path.resolve(__dirname, '../.eslintrc'),
      context: path.resolve(__dirname, '../src'),
      files: '**/*.js',
    }),
    new StyleLintPlugin({
      configFile: path.resolve(__dirname, '../.stylelintrc'),
      context: path.resolve(__dirname, '../src'),
      files: '**/*.css',
    }),
    new PrettierPlugin()
  ],
  module: {
    rules: [
      // HTML
      {
        test: /\.html$/,
        use: ['html-loader'],
      },

      // JS
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          }
        ],
      },

      // CSS
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },

      // Fonts
      {
        test: /\.woff2$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'assets/fonts/',
            },
          },
        ],
      },

      // Images
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'assets/images/',
            },
          },
        ],
      },

      // Audio
      {
        test: /\.mp3$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'assets/audio/',
            },
          },
        ],
      },

      // 3D Models
      {
        test: /\.(glb|gltf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'assets/models/',
            },
          },
        ],
      },

      // Shaders
      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        exclude: /node_modules/,
        use: [
          'raw-loader',
          'glslify-loader',
        ],
      },
    ],
  },
};
