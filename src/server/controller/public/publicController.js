'use strict';

//const {logger: log} = require('turing-logging');
const config = require('../../config');

module.exports = class PublicController {
  static index(request, response) {
  //  log.info('Hallo Welt!');
  //  log.warn('Die Apokalypse ist nah...');
//    log.error('Welt kaputt :-(');
    response.render('index', {
      title: 'Stupa Wahl 2017',
      rootPath: config.get('webserver:routes:root')
    });
  }
};
