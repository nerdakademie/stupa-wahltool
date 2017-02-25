'use strict';

const mongo = require('../db');

class TokenSchema extends mongo.Schema {
  constructor() {
    super({
      token: {
        type: String,
        required: true
      },
      contestantIDs: {
        type: Array,
        required: true
      }
    });
  }
}

mongo.model('Vote', new TokenSchema());
