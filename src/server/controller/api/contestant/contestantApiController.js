'use strict';

const Contestant = require('../../../db').model('Contestant');
const StudentApiController = require('../student/studentApiController');

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
    // TODO: check if strings are empty

    StudentApiController.validate(request, (validated) => {
      if (validated === true) {
        const contestant = new Contestant(request.body);
        contestant.activated = false;
        contestant.save((error) => {
          if (error) {
            return next(error);
          }
          return response.end();
        });
      } else {
        return next('error');
      }
    });
  }

};
