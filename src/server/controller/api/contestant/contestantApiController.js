'use strict';

const Contestant = require('../../../db').model('Contestant');
const StudentApiController = require('../student/studentApiController');
const xss = require('xss');

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

    StudentApiController.validate(request.body, (validated) => {
      if (validated === true) {
        const contestantJSON = request.body;
        contestantJSON.activated = false;
        contestantJSON.image = request.file.filename;
        // sanitize user inputs
        contestantJSON.name = xss(contestantJSON.name);
        contestantJSON.course = xss(contestantJSON.course);
        contestantJSON.year = xss(contestantJSON.year);
        contestantJSON.description = xss(contestantJSON.description);
        const contestant = new Contestant(request.body);
        contestant.save((error) => {
          if (error) {
            return next(error);
          }
          return response.status(200).json({success: true});
        });
      } else if (validated === false) {
        return response.status(400).json({success: false,
          error: {text: 'Deine Angaben konnten nicht validiert werden. \nVersuche es erneut'}});
      }
      return next('error');
    });
  }

};
