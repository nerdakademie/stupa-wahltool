'use strict';

const NodeMailer = require('nodemailer-wrapper');
const dbConf = require('../config');

module.exports = class Mailer {
  static sendMail(to, subject, text, html) {
    const transportConfig = {
      transportType: 'smtp',
      config: {
        host: 'nordakademie.de',
        secureConnection: true,
        port: 587,
        auth: {
          user: 'nerdakademie@nordakademie.de',
          pass: 'your-password'
        },
        maxConnections: 20,
        maxMessages: 10,
        tls: {
          rejectUnauthorized: false
        }
      }
    };

// use your mongodb address
    const
      host = dbConf.get('mongo:host');
    const
      port = dbConf.get('mongo:port');
    const
      db = dbConf.get('mongo:db');
    const
      user = dbConf.get('mongo:user');
    const
      password = dbConf.get('mongo:password');

    const
      userAndPassword = user && password ? `${user}:${password}@` : '';
    const
      mongoUri = `mongodb://${userAndPassword}${host}:${port}/${db}`;

// create new wrapper instance
    const
      mailer = new NodeMailer(mongoUri, transportConfig);

    const
      mail = {
        from: 'nerdakademie@nordakademie.de',
        to: to,
        subject: subject,
        text: text,
        html: html
      };

    mailer
      .prepareMail(mail);

    mailer
      .saveMails(
        (err) => {
          console
            .info(
              'mails have been saved !'
            )
          ;

          mailer
            .send(
              (err) => {
                if (err) {
                  console.log(err);
                }
              }
            )
          ;
        })
    ;
  }
};
