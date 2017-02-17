'use strict';

const multer = require('multer');
const srs = require('secure-random-string');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './resources/server/public/img');
  },
  filename: (req, file, callback) => {
    callback(null, `${srs({length: 16})}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

module.exports = class ImageUploadInterceptor {

  static getSingleInterceptorForName(fieldName) {
    return multer({storage}).single(fieldName);
  }

};
