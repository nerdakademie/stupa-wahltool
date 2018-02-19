'use strict';

const config = require('../../config');

module.exports = class PublicController {
  static index(request, response) {
    response.render('index', {
      title: 'StuPa-Wahl 208',
      rootPath: config.get('webserver:routes:root')
    });
  }
};
