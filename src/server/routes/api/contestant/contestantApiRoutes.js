'use strict';

const Express = require('express');
const ContestantApiController = require('../../../controller/api/contestant/contestantApiController');

module.exports = class ContestantApiRoutes extends Express.Router {
  constructor() {
    super();
    this.get('/', ContestantApiController.find);
    this.post('/', ContestantApiController.save);
  }
};
