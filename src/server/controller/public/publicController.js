'use strict';

const config = require('../../config');

module.exports = class PublicController {
  static index(request, response) {
    response.render('index', {
      title: 'Ainf Wahl 2017',
      rootPath: config.get('webserver:routes:root')
    });
  }
};
