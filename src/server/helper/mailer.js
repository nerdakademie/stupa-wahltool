'use strict';

const pug = require('pug');
const config = require('../config');
const nodemailer = require('nodemailer');
const format = require('string-template');

module.exports = class Mailer {

  static createMailTransporter() {
    return nodemailer.createTransport({
      pool: config.get('mailer:pool'),
      maxConnections: config.get('mailer:maxConnections'),
      maxMessages: config.get('mailer:maxMessages'),
      rateDelta: config.get('mailer:rateDelta'),
      rateLimit: config.get('mailer:rateLimit'),
      host: config.get('mailer:host'),
      secure: config.get('mailer:secure'),
      port: config.get('mailer:port'),
      auth: {
        user: config.get('mailer:user'),
        pass: config.get('mailer:pass')
      }
    });
  }

  static sendMail(transporter, to, subject, text, html) {
    return new Promise((resolve, reject) => {
      const mailOptions = {
        from: config.get('mailer:from'),
        to,
        subject,
        text,
        html
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return reject(error);
        }
        return resolve();
      });
    });
  }

  /*
  data: {
    template:{
      name: contestantConfirm,
      replace :[
      { placeholder: name,
        value: Blub}
        ]
      ]
    },
    to: kadse@nordakademie.de,
    subject: Wir mögen Kadsen
  }
   */
  static sendMailWithTemplate(transporter, data) {
    return new Promise((resolve, reject) => {
      const replacements = {};
      for (const replace of data.template.replace) {
        replacements[replace.placeholder] = replace.value;
      }
      const html = pug.renderFile(`resources/server/template/${data.template.name}.pug`, replacements);
      const text = format(config.get(`mailer:templates:${data.template.name}`), replacements);
      Mailer.sendMail(transporter, data.to, data.subject, text, html)
          .then(() => {
            return resolve();
          })
          .catch((error) => {
            return reject(error);
          });
    });
  }

};
