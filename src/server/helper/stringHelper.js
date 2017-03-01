'use strict';

module.exports = class StringHelper {
  static isNullOrEmptyString(obj) {
    return obj === null ||
        obj === undefined ||
        typeof obj !== 'string' ||
        obj.length === 0;
  }
};
