'use strict';

const mongo = require('../db');

class TokenSchema extends mongo.Schema {
  constructor() {
    super({
      token: {
        type: String,
        required: true
      },
      votedIDs: {
        type: Array,
        required: true
      }
    });
  }
}

mongo.model('vote', new TokenSchema());
