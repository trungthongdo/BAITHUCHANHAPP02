const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

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
