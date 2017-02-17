'use strict';

const NodeMailer = require('nodemailer-wrapper');
const pug = require('pug');
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
  static sendMailWithTemplat(config, data) {
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

    const
      mailer = new NodeMailer(mongoUri, transportConfig);


    const
      mail = {
        from: 'nerdakademie@nordakademie.de',
        to: config.to,
        subject: config.subject,
        text: pug.renderFile('../../ressources/server/view/text_${config.template}', data),
        html: pug.renderFile('../../ressources/server/view/html_${config.template}', data)
      };
// TODO Kann man mit Pug jeweils ein html und ein text template erstellen oder geht nur html?
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
