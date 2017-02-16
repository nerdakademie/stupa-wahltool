'use strict';

const mongo = require('../db');

class StudentSchema extends mongo.Schema {
  constructor() {
    super({
      name: {
        type: String,
        required: true
      },
      course: {
        type: String,
        required: true
      },
      year: {
        type: Number,
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
