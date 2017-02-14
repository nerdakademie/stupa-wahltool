'use strict';

const mongo = require('../db');

class TokenSchema extends mongo.Schema {
  constructor() {
    super({
      token: {
        type: String,
        required: true
      },
      contestantName: {
        type: String,
        required: true
      }
    });
  }
}

mongo.model('Token', new TokenSchema());
