'use strict';

const Express = require('express');
const ContestantApiController = require('../../../controller/api/contestant/contestantApiController');
const ImageUploadInterceptor = require('../../../helper/imageUploadInterceptor');

module.exports = class ContestantApiRoutes extends Express.Router {
  constructor() {
    super();
    this.get('/', ContestantApiController.find);
    this.get('/:id', ContestantApiController.findByID);
    this.post('/', ImageUploadInterceptor.getSingleInterceptorForName('contestantPhoto'), ContestantApiController.save);
    this.put('/', ImageUploadInterceptor.getSingleInterceptorForName('contestantPhoto'), ContestantApiController.edit);
    this.get('/activate', ContestantApiController.activate);
    this.get('/invalidate', ContestantApiController.invalidate);
  }
};
