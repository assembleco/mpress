const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

module.exports = {
  module: {
    rules,
  },
  plugins: plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],

    fallback: {
      "path": require.resolve('path-browserify'),
      "https": require.resolve("https-browserify"),
      "http": require.resolve("stream-http"),
      "stream": require.resolve("stream-browserify"),
      "zlib": require.resolve("browserify-zlib"),
      "os": require.resolve("os-browserify"),
      "process": require.resolve("process/browser"),
      "buffer": require.resolve("buffer/"),
      "canvas": require.resolve("canvas"),
      "perf_hooks": false,
      "fs": false,
      "child_process": false,
    }
  },
};
