'use strict';

const Express = require('express');
const ContestantApiController = require('../../../controller/api/contestant/contestantApiController');
const ImageUploadInterceptor = require('../../../helper/imageUploadInterceptor');
const StageCheckController = require('../../../controller/middleware/stageCheckController');

module.exports = class ContestantApiRoutes extends Express.Router {
  constructor() {
    super();
    this.get('/', ContestantApiController.getAll);
    this.get('/contestant', ContestantApiController.getSingle);
    this.post('/', StageCheckController.checkCandidationStage, ImageUploadInterceptor.getSingleInterceptorForName('contestantPhoto'), ContestantApiController.save);
    this.put('/', StageCheckController.checkCandidationStage, ImageUploadInterceptor.getSingleInterceptorForName('contestantPhoto'), ContestantApiController.edit);
    this.get('/activate', StageCheckController.checkCandidationStage, ContestantApiController.activate);
    this.get('/invalidate', StageCheckController.checkCandidationStage, ContestantApiController.invalidate);
  }
};
