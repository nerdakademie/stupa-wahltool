'use strict';

const Express = require('express');
const VoteApiController = require('../../../controller/api/vote/voteApiController');

module.exports = class VoteApiRoutes extends Express.Router {
  constructor() {
    super();
    this.get('/', VoteApiController.find);
  }
};
