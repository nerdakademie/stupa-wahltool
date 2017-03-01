'use strict';

const Student = require('../../../db').model('Student');

module.exports = class StudentApiController {

  static validate(json) {
    return new Promise((resolve, reject) => {
      const {year, course, firstName, lastName} = json;
      // TODO: check if not null

      Student.find({
        firstName: {
          $regex: StudentApiController.buildNameRegex(firstName),
          $options: 'g'
        },
        lastName,
        year,
        course
      }).exec()
          .then((students) => {
            if (students.length > 1) {
              return reject('Daten können nicht eindeutig einem Studenten zugeordnet werden');
            } else if (students.length === 1) {
              return resolve(students[0]);
            } else if (students.length === 0) {
              return reject('Keinen Studenten mit den angegebenen Daten gefunden');
            }
            return reject('Fehler bei der Validierung. Korrigiere deine Daten und versucher es erneut');
          })
          .catch((promiseError) => {
            return reject(promiseError.message);
          });
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
