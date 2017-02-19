'use strict';

const mongo = require('../db');

class ContestantVerificationSchema extends mongo.Schema {
  constructor() {
    super({
      token: {
        type: String,
        required: true
      },
      contestantID: {
        type: Number,
        required: true
      }
    });
  }
}

mongo.model('ContestantVerification', new ContestantVerificationSchema());
