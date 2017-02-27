'use strict';

const mongo = require('../db');

/*
two stage names:
candidation
voting
 */

class StageSchema extends mongo.Schema {
  constructor() {
    super({
      name: {
        type: String,
        required: true
      },
      startTime: {
        type: Date,
        required: true
      },
      endTime: {
        type: Date,
        required: true
      }
    });
  }
}

mongo.model('Stage', new StageSchema());
