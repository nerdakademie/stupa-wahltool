'use strict';

const Student = require('../../../../db').model('Student');

module.exports = class StudentCourseApiController {

  static find(request, response) {
    Student.distinct('course').lean()
        .exec()
        .then((courses) => {
          return response.json(courses);
        })
        .catch(() => {
          return response.status(500).json({success: false,
            error: {text: 'Datenbankfehler'}});
        });
  }
};
