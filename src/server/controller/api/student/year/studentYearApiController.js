'use strict';

const Student = require('../../../../db').model('Student');

module.exports = class StudentYearApiController {

  static find(request, response) {
    Student.distinct('year').lean()
        .exec()
        .then((years) => {
          return response.json(years);
        })
        .catch(() => {
          return response.status(500).json({success: false,
            error: {text: 'Datenbankfehler'}});
        });
  }

};
