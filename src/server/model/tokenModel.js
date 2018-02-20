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
            voted: {
                type: Boolean,
                default: false
            }
        });
    }
}

mongo.model('Token', new TokenSchema());
