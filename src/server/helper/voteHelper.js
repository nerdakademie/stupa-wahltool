'use strict';

const Vote = require('../db').model('Vote');
const uuid = require('uuid/v4');
const Mailer = require('./mailer');
const config = require('../config');
const argon2 = require('argon2');

module.exports = class VoteHelper {
  static sendVoteMailWithPromise(students) {
    const transporter = Mailer.createMailTransporter();
    return students.map((student) => {
      return VoteHelper.sendVoteMail(transporter, student);
    });
  }

  static sendVoteMail(transporter, student) {
    return new Promise((resolve, reject) => {
      const token = uuid();
      const data = {};
      data.to = student.email;
      data.subject = config.get('mailer:voteSubject');
      data.template = {};
      data.template.name = 'voteRequest';
      data.template.replace = [];
      data.template.replace.push({
        placeholder: 'name',
        value: student.firstName
      });
      data.template.replace.push({
        placeholder: 'voteLink',
        value: `${config.get('webserver:defaultProtocol')}://${config.get('webserver:url')}/list/${token}`
      });

      Mailer.sendMailWithTemplate(transporter, data)
        .then(() => {
          argon2.hash(student.email)
            .then((hash) => {
              const vote = new Vote({token,
                studentEmail: hash});
              vote.save((error2) => {
                if (error2) {
                  return reject(student.email);
                }
                return resolve();
              });
            });
        })
        .catch((promiseError) => {
          return reject(promiseError);
        });
    });
  }
};
