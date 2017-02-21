'use strict';

const Student = require('../../../db').model('Student');

module.exports = class StudentApiController {

  static validate(json, next) {
    const year = json.year;
    const course = json.course;
    const firstName = json.firstName;
    const lastName = json.lastName;

    // TODO: check if not null

    Student.find({firstName: {$regex: StudentApiController.buildNameRegex(firstName),
      $options: 'g'},
      lastName,
      year,
      course}).exec((error, students) => {
        if (error) {
          return next(error);
        }

        if (students.length > 1) {
          return next(false, null);
        } else if (students.length === 1) {
          return next(true, student);
        }
        return next(false, null);
      });
  }

  static unique(firstName, lastName, callback) {
    Student.count({firstName: {$regex: StudentApiController.buildNameRegex(firstName),
      $options: 'g'},
      lastName}).exec((error, count) => {
        if (error) {
          callback(false);
        }
        if (count === 1) {
          callback(true);
        } else {
          callback(false);
        }
      });
  }

  static buildNameRegex(name) {
    // TODO: make more safe
    const nameSplit = name.split(' ');
    let regexString = `(?=.*\\b${nameSplit[0]}\\b)`;
    for (let splitCount = 1; splitCount < nameSplit.length; splitCount++) {
      const part = nameSplit[splitCount];
      regexString = `${regexString}(?=.*\\b${part})`;
    }
    regexString = `${regexString}.*$`;
    return regexString;
  }
};
