'use strict';

const Contestant = require('../../../db').model('Contestant');

module.exports = class ContestantApiController {
  static find(request, response, next) {
    Contestant.find().exec((error, products) => {
      if (error) {
        return next(error);
      }
      return response.json(products);
    });
  }

  static save(request, response, next) {
    const contestant = new Contestant(request.body);
    contestant.save((error) => {
      if (error) {
        return next(error);
      }
      return response.end();
    });
  }
};
