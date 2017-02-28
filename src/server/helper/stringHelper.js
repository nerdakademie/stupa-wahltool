'use strict';

module.exports = class StringHelper {
  static isNullOrEmptyString(obj) {
    if (obj === null ||
        obj === undefined ||
        typeof(obj) !== 'string' ||
        obj.length === 0) {
      return true;
    }

    return false;
  }
};
