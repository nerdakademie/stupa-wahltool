'use strict';

const mongo = require('../db');

class TokenSchema extends mongo.Schema {
  constructor() {
    super({
      token: {
        type: String,
        required: true
      },
      studentEmail: {
        type: String,
        required: true
      },
      contestantIDs: {
        type: [mongo.Schema.Types.ObjectId],
        default: []
      }
    });
  }
}

mongo.model('Vote', new TokenSchema());
