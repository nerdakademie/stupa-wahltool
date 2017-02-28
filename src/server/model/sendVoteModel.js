'use strict';

const mongo = require('../db');

class SendVoteSchema extends mongo.Schema {
  constructor() {
    super({
      token: {
        type: String,
        required: true
      }
    });
  }
}

mongo.model('SendVote', new SendVoteSchema());
