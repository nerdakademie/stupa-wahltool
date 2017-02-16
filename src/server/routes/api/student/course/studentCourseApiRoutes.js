'use strict';

const Express = require('express');
const StudentCourseApiController = require('../../../../controller/api/student/course/studentCourseApiController');

module.exports = class StudentCourseApiRoutes extends Express.Router {
  constructor() {
    super();
    this.get('/', StudentCourseApiController.find);
  }
};
