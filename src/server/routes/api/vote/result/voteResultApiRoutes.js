'use strict';

const Express = require('express');
const VoteResultApiController = require('../../../../controller/api/vote/result/voteResultApiController');
const StageCheckController = require('../../../../controller/middleware/stageCheckController');

module.exports = class VoteResultApiRoutes extends Express.Router {
  constructor() {
    super();
    this.get('/', VoteResultApiController.basicResults);
  }
};
