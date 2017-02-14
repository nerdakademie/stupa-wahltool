'use strict';

const Express = require('express');
const ProductApiRoutes = require('./product/productApiRoutes');
const ContestantApiRoutes = require('./contestant/contestantApiRoutes');

module.exports = class ApiRoutes extends Express.Router {
  constructor() {
    super();
    this.use('/products', new ProductApiRoutes());
    this.use('/contestant', new ContestantApiRoutes());
  }
};
