module.exports = {
  jest(config) {
    // eslint-disable-next-line no-param-reassign
    config.moduleNameMapper = {
      '^react-native$': 'react-native-web',
      localforage: '<rootDir>/mocks/localforageMock.js',
      '\\.(css|less)$': 'identity-obj-proxy',
    };

    return config;
  },
  webpack(config) {
    // This is very fragile and liable to change with updates to React Scripts
    // It is necessary in order to keep build sizes down since there is a lot of Unicode
    // See https://github.com/facebook/create-react-app/issues/2706
    // eslint-disable-next-line no-param-reassign
    config.optimization.minimizer[0].options.terserOptions.output.ascii_only = false;

    return config;
  },
};
