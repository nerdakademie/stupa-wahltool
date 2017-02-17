'use strict';

const NodeMailer = require('nodemailer-wrapper');
const pug = require('pug');
const config = require('../config');

module.exports = class Mailer {
  static sendMail(to, subject, text, html) {
    const transportConfig = {
      transportType: 'smtp',
      config: {
        host: config.get('mailer:host'),
        secureConnection: config.get('mailer:secureConnection'),
        port: config.get('mailer:port'),
        auth: {
          user: config.get('mailer:user'),
          pass: config.get('mailer:pass')
        },
        maxConnections: config.get('mailer:maxConnections'),
        maxMessages: config.get('mailer:maxMessages'),
        tls: {
          rejectUnauthorized: config.get('mailer:tlsrejectUnauthorized')
        }
      }
    };

    // db Zugang um Mails zu puffern
    const host = config.get('mongo:host');
    const port = config.get('mongo:port');
    const db = config.get('mongo:db');
    const user = config.get('mongo:user');
    const password = config.get('mongo:password');
    const userAndPassword = user && password ? `${user}:${password}@` : '';
    const mongoUri = `mongodb://${userAndPassword}${host}:${port}/${db}`;

    const mailer = new NodeMailer(mongoUri, transportConfig);

    const mail = {
      from: 'nerdakademie@nordakademie.de',
      to, // can be a comma seperated list
      subject,
      text,
      html
    };

    mailer.prepareMail(mail);

    mailer.saveMails((err) => {
      console.info(
        'mails have been saved !'
      )
      ;

      mailer.send((err) => {
          if (err) {
            console.log(err);
          }
        }
      )
      ;
    })
    ;
  }

  /* sends a mail based on a predefined template.
   * config must contain config.to, config.subject, config.template.
   * data has to contain the information which are needed by the template.
   */
  static sendMailWithTemplat(config, data) {
    const transportConfig = {
      transportType: 'smtp',
      config: {
        host: config.get('mailer:host'),
        secureConnection: config.get('mailer:secureConnection'),
        port: config.get('mailer:port'),
        auth: {
          user: config.get('mailer:user'),
          pass: config.get('mailer:pass')
        },
        maxConnections: config.get('mailer:maxConnections'),
        maxMessages: config.get('mailer:maxMessages'),
        tls: {
          rejectUnauthorized: config.get('mailer:tlsrejectUnauthorized')
        }
      }
    };

    // db Zugang um Mails zu puffern
    const host = config.get('mongo:host');
    const port = config.get('mongo:port');
    const db = config.get('mongo:db');
    const user = config.get('mongo:user');
    const password = config.get('mongo:password');
    const userAndPassword = user && password ? `${user}:${password}@` : '';
    const mongoUri = `mongodb://${userAndPassword}${host}:${port}/${db}`;

    const mailer = new NodeMailer(mongoUri, transportConfig);

    const mail = {
      from: 'nerdakademie@nordakademie.de',
      to: config.to, // can be a comma seperated list
      subject: config.subject,
      text: pug.renderFile('../../ressources/server/view/text_${config.template}', data),
      html: pug.renderFile('../../ressources/server/view/html_${config.template}', data)
    };
// TODO Kann man mit Pug jeweils ein html und ein text template erstellen oder geht nur html?
    mailer.prepareMail(mail);

    mailer.saveMails((err) => {
      console.info(
        'mails have been saved !'
      )
      ;

      mailer.send(
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
