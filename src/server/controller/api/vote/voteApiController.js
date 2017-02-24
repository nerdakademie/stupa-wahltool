'use strict';

const Vote = require('../../../db').model('Vote');

module.exports = class VoteApiController {

  static find(request, response, next) {
    Vote.find().lean().exec((error, votes) => {
      if (error) {
        return next(error);
      }
      return response.json(votes);
    });
  }

};
