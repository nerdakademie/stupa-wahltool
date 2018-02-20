'use strict';

const Token = require('../db').model('Token');
const uuid = require('uuid/v4');
const Mailer = require('./mailer');
const config = require('../config');


module.exports = class VoteHelper {
  static sendVoteMailWithPromise(students) {
    const transporter = Mailer.createMailTransporter();
    return students.map((student) => {
      return VoteHelper.sendVoteMail(transporter, student);
    });
  }

  static sendVoteMail(transporter, student) {
    return new Promise((resolve, reject) => {
      const generatedToken = uuid();
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
        value: `${config.get('webserver:defaultProtocol')}://${config.get('webserver:url')}/list/${generatedToken}`
      });

      Mailer.sendMailWithTemplate(transporter, data)
        .then(() => {

          const token = new Token({token: generatedToken,
                studentEmail: student.email});
              token.save((error2) => {
                console.log(error2);
                if (error2) {
                  return reject(student.email);
                }

            });
        })
        .catch((promiseError) => {
          return reject(promiseError);
        });
    });
  }
};
