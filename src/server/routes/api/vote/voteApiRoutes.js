'use strict';

const Express = require('express');
const VoteApiController = require('../../../controller/api/vote/voteApiController');
const StageCheckController = require('../../../controller/middleware/stageCheckController');
const VoteResultApiRoutes = require('./result/voteResultApiRoutes');

module.exports = class VoteApiRoutes extends Express.Router {
  constructor() {
    super();
    this.use('/results', new VoteResultApiRoutes());
    this.get('/:token', StageCheckController.checkVotingStage, VoteApiController.findOne);
    this.post('/', StageCheckController.checkVotingStage, VoteApiController.save);
    this.post('/findToken', VoteApiController.findTokenByEmail);
    this.post('/send', StageCheckController.checkVotingStage, VoteApiController.sendVoteTokens);
    this.post('/sendMissing', StageCheckController.checkVotingStage, VoteApiController.sendMissingVoteTokens);
  }
};
