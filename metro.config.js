const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    extraNodeModules: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      url: require.resolve('url'),
      zlib: require.resolve('browserify-zlib'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      net: require.resolve('node-libs-browser/mock/net'),
      tls: require.resolve('node-libs-browser/mock/tls'),
      fs: require.resolve('node-libs-browser/mock/empty'),
      path: require.resolve('path-browserify'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
