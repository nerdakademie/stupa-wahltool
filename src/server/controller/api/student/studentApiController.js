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

  static validate(request, response, next){
    const year = request.body.year;
    const course = request.body.course;
    const name = request.body.name;

    // TODO: check if not null

    Student.find({'name':{ '$regex': StudentApiController.buildNameRegex(name), '$options': 'g' }, 'year': year, 'course': course}).exec((error, students) => {
      if (error) {
        return next(error);
      }

      if (students.length > 1 || students.length <= 0) {
        return next('error'); // TODO: fix
      } else if (students.length === 1) {
        return response.json('{success: true}');
      }
    });
  }

  static buildNameRegex(name) {
    // TODO: make more safe
    const nameSplit = name.split(' ');
    const regexString = `(?=.*\b${nameSplit[0]}\b)`;
    for (let splitCount = 1; splitCount < nameSplit.length; splitCount++) {
      const part = nameSplit[splitCount];
      regexString.concat(`(?=.*\b${part})`);
    }
    regexString.concat('.*$');
    return regexString;
  }
};
