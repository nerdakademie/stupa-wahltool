'use strict';

const Contestant = require('../../../db').model('Contestant');
const ContestantVerification = require('../../../db').model('ContestantVerification');
const StudentApiController = require('../student/studentApiController');
const xss = require('xss');
const fs = require('fs');
const ContestantHelper = require('../../../helper/contestantHelper');
const config = require('../../../config');

module.exports = class ContestantApiController {

  static find(request, response, next) {
    Contestant.find({activated: 1}).exec((error, products) => {
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
        contestant.save((error, savedContestant) => {
          if (error) {
            return next(error);
          }
          ContestantHelper.sendActivationMail(savedContestant, (result) => {
            if (result === false) {
              return response.status(400).json({success: false,
                error: {text: 'Fehler beim Versand der Bestätigungsmail'}});
            } else {
              return response.status(200).json({success: true});
            }
          });
        });
      } else if (validated === false) {
        fs.unlink(request.file.path, (error) => {
          if (error) {
            console.log(error);
          }
        });
        return response.status(400).json({success: false,
          error: {text: 'Deine Angaben konnten nicht validiert werden. \nVersuche es erneut'}});
      }
      //return next('error');
    });
  }

  static activate(request, response, next) {
    if (request.query.token === undefined) {
      return response.status(400).json({success: false,
        error: {text: 'Missing token parameter'}});
    } else {
      ContestantVerification.findOne({token: request.query.token}).exec((error, validation) => {
        if (error || validation === null) {
          return response.status(400).json({success: false,
            error: {text: 'Error while validating token'}});
        } else {
          Contestant.findOne({_id: validation.contestantID}).exec((error2, contestant) => {
            if (error2) {
              return response.status(400).json({success: false,
                error: {text: 'Error while updating contestant'}});
            }
            contestant.activated = true;
            contestant.save();
            response.writeHead(301, {Location: `${config.get('webserver:defaultProtocol')}://${config.get('webserver:url')}/list`});
            return response.end();
          });
        }
      });
    }
  }
};
