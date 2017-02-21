'use strict';

const mongo = require('../db');

class StudentSchema extends mongo.Schema {
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
      email: {
        type: String,
        required: true
      }
    });
  }
}

mongo.model('Student', new StudentSchema());
