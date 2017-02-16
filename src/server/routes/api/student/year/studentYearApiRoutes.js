'use strict';

const Express = require('express');
const StudentYearApiController = require('../../../../controller/api/student/year/studentYearApiController');

module.exports = class StudentYearApiRoutes extends Express.Router {
  constructor() {
    super();
    this.get('/', StudentYearApiController.find);
  }
};
