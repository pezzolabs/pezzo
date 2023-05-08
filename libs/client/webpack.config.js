const { composePlugins, withNx } = require("@nx/webpack");

module.exports = composePlugins(withNx(), (config, { options, context }) => {
  // customize webpack config here

  config.experiments = {
    ...config.experiments,
    asyncWebAssembly: true,
  };

  return config;
});
