'use strict';

const Express = require('express');
const config = require('../config');
const PublicRoutes = require('./public/publicRoutes');
const ApiRoutes = require('./api/apiRoutes');
const ErrorRoutes = require('./errorRoutes');

module.exports = class Routes extends Express.Router {
  constructor() {
    super();
    this.use(config.get('webserver:routes:root'), new PublicRoutes());
    this.use(`${config.get('webserver:routes:root')}/api`, new ApiRoutes());

  /*  this.get(`${config.get('turing-example:server:routes:root')}/api/status/:status/:message`, (reqest, response) => {
      turingStatus.addStatusDetail('toll', reqest.params.status, reqest.params.message);
      response.end();
    });*/

    this.use(new ErrorRoutes());
  }
};
