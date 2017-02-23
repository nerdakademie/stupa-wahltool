'use strict';

const Student = require('../../../../db').model('Student');

module.exports = class StudentCourseApiController {

  static find(request, response, next) {
    Student.distinct('course').lean().exec((error, years) => {
      if (error) {
        return next(error);
      }
      return response.json(years);
    });
  }

};
