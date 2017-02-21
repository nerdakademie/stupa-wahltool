'use strict';

const mongo = require('../db');

class ContestantSchema extends mongo.Schema {
  constructor() {
    super({
      firstName: {
        type: String,
        required: true
      },
      lastName: {
        type: String,
        required: true
      },
      course: {
        type: String,
        required: true
      },
      year: {
        type: String,
        required: true
      },
      centuria: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      image: {
        type: String,
        required: true
      },
      activated: {
        type: Boolean,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    });
  }
}

mongo.model('Contestant', new ContestantSchema());
