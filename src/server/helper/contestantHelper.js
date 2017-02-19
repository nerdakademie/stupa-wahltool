'use strict';

const Student = require('../db').model('Student');
const ContestantVerification = require('../db').model('ContestantVerification');
const uuid = require('uuid/v4');
const Mailer = require('./mailer');
const config = require('../config');
const pug = require('pug');

module.exports = class ContestantHelper {

  static sendActivationMail(contestant, callback) {
    Student.findOne({name: {$regex: ContestantHelper.buildNameRegex(contestant.name),
      $options: 'g'},
      year: contestant.year,
      course: contestant.course}).exec((error, student) => {
        if (error) {
          return callback(error);
        }

        const token = uuid();
        const data = {};
        data.to = student.email;
        data.subject = config.get('mailer:contestantSubject');
        data.template = {};
        data.template.name = 'contestantConfirm';
        data.template.replace = [];
        data.template.replace.push({placeholder: 'name',
          value: student.name});
        data.template.replace.push({placeholder: 'link',
          value: `http://${config.get('webserver:url')}/api/contestants/activate?token=${token}`});

        const contestantVerification = new ContestantVerification({token,
          contestantID: contestant.id});
        contestantVerification.save((error2) => {
          console.log(error2);
          if (error2) {
            return callback(false);
          }
          Mailer.sendMailWithTemplate(data);
        }).then((result) => {
          return callback(true);
        }, (err) => {
          return callback(false);
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
