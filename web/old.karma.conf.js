var path = require('path');
require('babel-core/register')

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha'],
    files: [
      // './__tests__/index.js'
      // './node_modules/fbw-platform-common/**/*.js',
      // 'src/**/*.unit-spec.js',
    ],

    preprocessors: {
      // add webpack as preprocessor
      // './**/*.js': ['webpack', 'sourcemap'],
      // './!(node_modules)/**/*.js': ['webpack'],
      './node_modules/fbw-platform-common/**/*.js': ['webpack']
    },

    webpack: { //kind of a copy of your webpack config
      devtool: 'cheap-module-source-map',
      // devtool: 'inline-source-map', //just do inline source maps instead of the default
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: 'babel',
            // include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'node_modules/fbw-platform-common')]
            // exclude: path.resolve(__dirname, 'node_modules'),
            query: {
              // presets: ["airbnb"],
              presets: ["es2015", "react", "stage-0"]
            }
          },
          {
            test: /\.json$/,
            loader: 'json',
          },
          {
            test    : /\.css$/,
            loaders : [
              'style',
              'css',
            ]
          },
          {
            test    : /\.scss$/,
            loaders : [
              'style',
              'css',
              'sass?sourceMap'
            ]
          },
          { test: /\.(png|jpg)$/,    loader: 'url?limit=8192' }
        ]
      },
      externals: {
        'react/addons': true,
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true
      },
      sassLoader : {
        includePaths : ['./src/', './styles/']
      }
    },

    webpackServer: {
      // noInfo: true //please don't spam the console when running in karma!
    },

    plugins: [
      'karma-babel-preprocessor',
      // 'karma-browserify',
      'karma-webpack',
      // 'karma-jasmine',
      'karma-mocha',
      'karma-sourcemap-loader',
      'karma-chrome-launcher',
      // 'karma-phantomjs-launcher'
    ],
    browserify: {
      debug: true,
      transform: [
        'babelify',
      ]
    },
    babelPreprocessor: {
      options: {
        // presets: ['es2015', 'react', 'stage-0', 'transform-class-properties']
        presets: ["es2015", "airbnb", "transform-class-properties"]
        // presets: ["airbnb"]
      }
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    // logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['Chrome'],
    singleRun: false,
    browserDisconnectTolerance: 10
  })
};
