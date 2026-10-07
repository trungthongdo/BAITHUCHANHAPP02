const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  server: {
    rewriteRequestUrl: (url) => {
      const requestUrl = new URL(url, 'http://localhost');
      requestUrl.searchParams.set('lazy', 'false');
      return `${requestUrl.pathname}${requestUrl.search}${requestUrl.hash}`;
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
