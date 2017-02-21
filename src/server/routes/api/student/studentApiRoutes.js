'use strict';

const Express = require('express');
const StudentApiController = require('../../../controller/api/student/studentApiController');
const StudentYearApiRoutes = require('./year/studentYearApiRoutes');
const StudentCourseApiRoutes = require('./course/studentCourseApiRoutes');

module.exports = class StudentApiRoutes extends Express.Router {
  constructor() {
    super();

    this.get('/validate', StudentApiController.validate);

    this.use('/years', new StudentYearApiRoutes());
    this.use('/courses', new StudentCourseApiRoutes());
  }
};
