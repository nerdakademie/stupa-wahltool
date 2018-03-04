'use strict';

const Express = require('express');
const VoteResultApiController = require('../../../../controller/api/vote/result/voteResultApiController');
const StageCheckController = require('../../../../controller/middleware/stageCheckController');

module.exports = class VoteResultApiRoutes extends Express.Router {
  constructor() {
    super();
    this.get('/', StageCheckController.checkAfterVotingStage, VoteResultApiController.basicResults);
    this.get('/participation', StageCheckController.checkAfterVotingStage, VoteResultApiController.participation);
    this.get('/votesPerCourse', StageCheckController.checkAfterVotingStage, VoteResultApiController.votesPerCourse);
    this.get('/votesPerYear', StageCheckController.checkAfterVotingStage, VoteResultApiController.votesPerYear);
    this.get('/votesPerCourseAndYear', StageCheckController.checkAfterVotingStage, VoteResultApiController.votesPerCourseAndYear);
  }
};
