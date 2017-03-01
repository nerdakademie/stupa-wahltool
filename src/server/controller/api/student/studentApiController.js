'use strict';

const Student = require('../../../db').model('Student');

module.exports = class StudentApiController {

  static validate(json, next) {
    const {year, course, firstName, lastName} = json;
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
          return next('Daten können nicht eindeutig einem Studenten zugeordnet werden', null);
        } else if (students.length === 1) {
          return next(true, students[0]);
        } else if (students.length === 0) {
          return next('Keinen Studenten mit den angegebenen Daten gefunden', null);
        }
        return next('Fehler bei der Validierung. Korrigiere deine Daten und versucher es erneut', null);
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
