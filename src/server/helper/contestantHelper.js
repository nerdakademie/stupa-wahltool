'use strict';

const Student = require('../db').model('Student');
const Contestant = require('../db').model('Contestant');
const uuid = require('uuid/v4');
const Mailer = require('./mailer');
const config = require('../config');
const pug = require('pug');

module.exports = class ContestantHelper {

  static sendActivationMail(contestantJSON, callback) {
    Student.findOne({firstName: {$regex: ContestantHelper.buildNameRegex(contestantJSON.firstName),
      $options: 'g'},
      lastName: contestantJSON.lastName,
      year: contestantJSON.year,
      course: contestantJSON.course}).exec((error, student) => {
        if (error) {
          return callback(error);
        }
        if (student === null) {
          return callback(false);
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

        contestantJSON.token = token;
        contestantJSON.centuria = student.centuria;

        const contestant = new Contestant(contestantJSON);
        contestant.save((error2) => {
          console.log(error2);
          if (error2) {
            return callback(false);
          }
          return Mailer.sendMailWithTemplate(data);
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
