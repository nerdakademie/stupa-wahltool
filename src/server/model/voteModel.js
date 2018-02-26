'use strict';

const mongo = require('../db');

class TokenSchema extends mongo.Schema {
  constructor() {
    super({
      voterCourse: {
        type: String,
        required: true
      },
      voterYear: {
        type: Number,
        required: true
      },
      contestantID: {
        type: String,
        required: true

      },
      revocationToken: {
        type: String,
        required: true
      }
    });
  }
}

mongo.model('Vote', new TokenSchema());
