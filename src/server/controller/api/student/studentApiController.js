'use strict';

const Student = require('../../../db').model('Student');

module.exports = class StudentApiController {
  static find(request, response, next) {
    Student.find().exec((error, students) => {
      if (error) {
        return next(error);
      }
      return response.json(students);
    });
  }

  static save(request, response, next) {
    const student = new Student(request.body);
    student.save((error) => {
      if (error) {
        return next(error);
      }
      return response.end();
    });
  }

  static validate(json, next) {
    const year = json.year;
    const course = json.course;
    const name = json.name;

    // TODO: check if not null

    Student.find({'name': {$regex: StudentApiController.buildNameRegex(name), $options: 'g'}, 'year': year, 'course': course}).exec((error, students) => {

      if (error) {
        return next(error);
      }

      if (students.length > 1) {
        return next(false);
      } else if (students.length === 1) {
        return next(true);
      }
      return next(false);
    });
  }

  static buildNameRegex(name) {
    // TODO: make more safe
    const nameSplit = name.split(' ');
    let regexString = `(?=.*\\b${nameSplit[0]}\\b)`;
    for (let splitCount = 1; splitCount < nameSplit.length; splitCount++) {
      const part = nameSplit[splitCount];
      regexString = regexString + `(?=.*\\b${part})`;
    }
    regexString = regexString + '.*$';
    return regexString;
  }
};
