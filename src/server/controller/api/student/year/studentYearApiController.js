'use strict';

const Student = require('../../../../db').model('Student');

module.exports = class StudentYearApiController {

  static find(request, response, next) {
    Student.distinct('year', (error, years) => {
      if (error) {
        return next(error);
      }
      return response.json(years);
    });
  }

};
