const HtmlWebpackPlugin = require('html-webpack-plugin'); // generate an html file
const WebpackPwaManifest = require('webpack-pwa-manifest'); // generate a manifest.json file
const path = require('path'); // manipulate paths
const { InjectManifest } = require('workbox-webpack-plugin'); // service worker, precache

// TODO: Add and configure workbox plugins for a service worker and manifest file.
// TODO: Add CSS loaders and babel to webpack.

module.exports = () => {
  return {
    mode: 'development',
    entry: { // The entry points to my app. Webpack starts bundling here
      main: './src/js/index.js',
      install: './src/js/install.js',
      header: './src/js/header.js'
    },
    output: { // Our custom name for our bundle and location
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [ // plugins for our PWA
      // Webpack plugin that generates our html file and injects our bundles. 
      new HtmlWebpackPlugin({
        template: './index.html', // File Location
        title: 'Text Editor' // Title for the output HTML file
      }),

      // Creates and Injects our custom service worker.
      new InjectManifest({
        swSrc: './src-sw.js',
        swDest: 'src-sw.js',
      }),

      new WebpackPwaManifest({
        fingerprints: false,
        inject: true, // tells the plugin to automatically add and link our manifest.json file to our html file
        name: 'PWA JATE',
        short_name: 'JATE',
        description: 'Edit your Text!',
        background_color: '#225ca3',
        theme_color: '#225ca3',
        start_url: './',
        publicPath: './',
        icons: [
          {
            src: path.resolve('src/images/logo.png'),
            sizes: [96, 128, 192, 256, 384, 512],
            destination: path.join('assets', 'icons'),
          },
        ],
      }),
    ],

    module: { // the rules for certain files, and images are handled
      rules: [
        // For our .css files
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },

        // For our .js files
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: [
                '@babel/plugin-proposal-object-rest-spread',
                '@babel/plugin-transform-runtime'
              ],
            },
          },
        },
      ],
    },
  };
};

