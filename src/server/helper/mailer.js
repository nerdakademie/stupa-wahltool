'use strict';

const pug = require('pug');
const config = require('../config');
const nodemailer = require('nodemailer');

module.exports = class Mailer {

  static sendMail(to, subject, text, html) {
    const transporter = nodemailer.createTransport({
      host: config.get('mailer:host'),
      secure: config.get('mailer:secure'),
      port: config.get('mailer:port'),
      auth: {
        user: config.get('mailer:user'),
        pass: config.get('mailer:pass')
      }
    });

    const mailOptions = {
      from: config.get('mailer:from'),
      to,
      subject,
      text,
      html
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return false;
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
      return true;
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
  static sendMailWithTemplate(data) {
    const text = config.get(`mailer:templates:${data.template.name}`);
    const htmlReplacements = {};
    for (const replace of data.template.replace) {
      text.replace(`%${replace.placeholder}%`, replace.value);
      htmlReplacements[replace.placeholder] = replace.value;
    }
    const html = pug.renderFile(`resources/server/template/${data.template.name}.pug`, htmlReplacements);
    Mailer.sendMail(data.to, data.subject, text, html);
  }
};
