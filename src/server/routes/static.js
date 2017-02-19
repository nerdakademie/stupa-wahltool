'use strict';

const config = require('../config');
const webpackClientDevConfig = require('../../../resources/client/webpack/webpack-client-dev.config.js');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const Express = require('express');

module.exports = class StaticRoutes extends Express.Router {
  constructor() {
    super();
    if (config.get('webserver:env') === 'local') {
      webpackClientDevConfig.output.publicPath = config.get('webserver:routes:root');
      const compiler = webpack(webpackClientDevConfig);
      const publicWebpackDevMiddleware = webpackDevMiddleware(compiler, {
        publicPath: webpackClientDevConfig.output.publicPath,
        stats: {
          colors: true,
          chunks: false
        }
      });

      this.use(publicWebpackDevMiddleware);
      this.use(webpackHotMiddleware(compiler));
    } else {
      this.use(config.get('webserver:routes:root'),
        Express.static(`${__dirname}/../../../resources/server/public`, {maxAge: '1m'}));
    }
  }
};
