'use strict';

const Express = require('express');
const config = require('../config');
const PublicRoutes = require('./public/publicRoutes');
const ApiRoutes = require('./api/apiRoutes');
const ErrorRoutes = require('./errorRoutes');

module.exports = class Routes extends Express.Router {
  constructor() {
    super();
    this.use(`${config.get('webserver:routes:root')}/api`, new ApiRoutes());
    this.use(config.get('webserver:routes:root'), new PublicRoutes());

    this.use(new ErrorRoutes());
  }
};
