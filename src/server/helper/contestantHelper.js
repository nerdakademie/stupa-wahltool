'use strict';

const Contestant = require('../db').model('Contestant');
const uuid = require('uuid/v4');
const Mailer = require('./mailer');
const config = require('../config');
const pug = require('pug');

module.exports = class ContestantHelper {

  static sendActivationMail(contestantJSON, student) {
    return new Promise((resolve, reject) => {
      const token = uuid();
      const data = {};
      data.to = student.email;
      data.subject = config.get('mailer:contestantSubject');
      data.template = {};
      data.template.name = 'contestantConfirm';
      data.template.replace = [];
      data.template.replace.push({
        placeholder: 'name',
        value: student.firstName
      });
      data.template.replace.push({
        placeholder: 'token',
        value: token
      });
      data.template.replace.push({
        placeholder: 'acceptLink',
        value: `${config.get('webserver:defaultProtocol')}://${config.get('webserver:url')}/api/contestants/activate?token=${token}`
      });
      data.template.replace.push({
        placeholder: 'removeLink',
        value: `${config.get('webserver:defaultProtocol')}://${config.get('webserver:url')}/api/contestants/invalidate?token=${token}&firstName=${contestantJSON.firstName}&lastName=${contestantJSON.lastName}`
      });
      data.template.replace.push({
        placeholder: 'applicationText',
        value: contestantJSON.description
      });

      contestantJSON.token = token;
      contestantJSON.centuria = student.centuria;

      Mailer.sendMailWithTemplate(Mailer.createMailTransporter(), data)
          .then(() => {
            const contestant = new Contestant(contestantJSON);
            contestant.save((saveError) => {
              if (saveError) {
                return reject(saveError);
              }
              return resolve();
            });
          })
          .catch((promiseError) => {
            return reject(promiseError);
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
