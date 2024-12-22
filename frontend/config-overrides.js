const webpack = require('webpack');  // Import webpack
const path = require('path');

module.exports = function override(config, env) {
  // Add polyfills for Node.js built-ins that are commonly used in the browser
  config.resolve.fallback = {
    crypto: require.resolve('crypto-browserify'), // Polyfill for crypto
    stream: require.resolve('stream-browserify'),  // Polyfill for stream
    process: require.resolve('process/browser'),  // Polyfill for process
    buffer: require.resolve('buffer/')    ,         // Polyfill for buffer (if needed)
    // http: require.resolve('stream-http'),
  };

  // Add ProvidePlugin to inject 'process' and other global Node.js objects
  config.plugins = [
    ...config.plugins,  // Retain existing plugins
    new webpack.ProvidePlugin({
      process: 'process/browser',  // Automatically provide 'process' wherever it's used
      Buffer: ['buffer', 'Buffer'],  // Provide Buffer globally (if needed)
    }),
  ];

  // Optionally, configure the alias for some Node.js modules if needed
  config.resolve.alias = {
    ...config.resolve.alias,
    util: require.resolve('util/'),
  };

  return config;
};
