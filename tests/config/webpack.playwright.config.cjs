const webpack = require('webpack');
const baseConfig = require('../../webpack.config');

const apiUrl = 'http://127.0.0.1:4174/api';

module.exports = {
  ...baseConfig,
  plugins: [
    ...baseConfig.plugins.filter(
      (plugin) => plugin.constructor.name !== 'Dotenv'
    ),
    new webpack.DefinePlugin({
      'process.env.BURGER_API_URL': JSON.stringify(apiUrl)
    })
  ],
  devServer: {
    ...baseConfig.devServer,
    open: false,
    port: 4173
  }
};
