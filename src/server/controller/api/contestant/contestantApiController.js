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

    StudentApiController.validate(request.body, (validated) => {
      if (validated === true) {
        const contestantJSON = request.body;
        contestantJSON.activated = false;
        contestantJSON.image = request.file.filename;
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
