module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            assets: './assets',
            backend: './backend',
            components: './components',
            config: './config',
            constants: './constants',
            contexts: './contexts',
            navigation: './navigation',
            screens: './screens',
            utils: './utils',
            api: './api'
          },
        },
      ],
    ],
  };
};
