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
        default: []
      }
    });
  }
}

mongo.model('Vote', new TokenSchema());
