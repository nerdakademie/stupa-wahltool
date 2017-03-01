'use strict';

const Express = require('express');
const VoteApiController = require('../../../controller/api/vote/voteApiController');
const StageCheckController = require('../../../controller/middleware/stageCheckController');

module.exports = class VoteApiRoutes extends Express.Router {
  constructor() {
    super();
    this.get('/:token', StageCheckController.checkVotingStage, VoteApiController.findOne);
    this.post('/', StageCheckController.checkVotingStage,  VoteApiController.save);
    this.post('/send', StageCheckController.checkVotingStage, VoteApiController.sendVoteTokens);
  }
};
