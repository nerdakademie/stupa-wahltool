'use strict';

//const {logger: log} = require('turing-logging');
const config = require('../../config');

module.exports = class PublicController {
  static index(request, response) {
  //  log.info('Hallo Welt!');
  //  log.warn('Die Apokalypse ist nah...');
//    log.error('Welt kaputt :-(');
    response.render('index', {
      title: 'turing-example',
      rootPath: '127.0.0.1:8990' + config.get('webserver:routes:root')
    });
  }
};
