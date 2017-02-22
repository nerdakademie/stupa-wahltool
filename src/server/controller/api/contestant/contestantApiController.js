'use strict';

const Contestant = require('../../../db').model('Contestant');
const StudentApiController = require('../student/studentApiController');
const xss = require('xss');
const fs = require('fs');
const ContestantHelper = require('../../../helper/contestantHelper');
const config = require('../../../config');

module.exports = class ContestantApiController {

  static find(request, response, next) {
    Contestant.find({activated: 1}).select('-token -__v').exec((error, products) => {
      if (error) {
        return next(error);
      }
      return response.json(products);
    });
  }

  static save(request, response) {
    // TODO: check if strings are empty
    if (request.body.firstName === undefined || request.body.lastName === undefined || request.body.course === undefined || request.body.year === undefined ||
      request.body.description === undefined || request.file === undefined) {
      return response.status(400).json({success: false,
        error: {text: 'Es wurden nicht alle notwendingen Felder ausgefüllt'}});
    }
    if (request.body.description.length > 1500) {
      return response.status(400).json({success: false,
        error: {text: 'Bewerbungstext ist zu lang'}});
    }
    const contestantJSON = request.body;

    Contestant.count({firstName: {$regex: ContestantHelper.buildNameRegex(contestantJSON.firstName),
      $options: 'g'},
      lastName: contestantJSON.lastName}).exec((countError, count) => {
        if (countError) {
          return response.status(400).json({success: false,
            error: {text: 'Deine Angaben konnten nicht validiert werden. \nVersuche es erneut'}});
        }

        if (count >= 1) {
          return response.status(200).json({success: false,
            error: {text: 'Du hast dich bereits aufgestellt.'}});
        }
        StudentApiController.validate(request.body, (validated, student) => {
          if (validated === true) {
            console.log(student);
            contestantJSON.activated = false;
            contestantJSON.image = request.file.filename;
              // sanitize user inputs
            contestantJSON.firstName = xss(contestantJSON.firstName);
            contestantJSON.lastName = xss(contestantJSON.lastName);
            contestantJSON.course = student.course;
            contestantJSON.year = student.year;
            contestantJSON.centuria = student.centuria;
            contestantJSON.description = xss(contestantJSON.description);
            contestantJSON.token = '';
            ContestantHelper.sendActivationMail(contestantJSON, student, (result) => {
              if (result === false) {
                return response.status(200).json({
                  success: false,
                  error: {text: 'Fehler beim Versand der Bestätigungsmail'}
                });
              }
              return response.status(200).json({success: true});
            });
          } else if (validated !== true) {
            if (request.file.path !== undefined) {
              fs.unlink(request.file.path, (error) => {
                if (error) {
                  console.log(error);
                }
              });
            }
            return response.status(200).json({
              success: false,
              error: {text: validated}
            });
          }
            // return next('error');
        });
      });
  }

  static activate(request, response) {
    if (request.query.token === undefined) {
      return response.status(400).json({success: false,
        error: {text: 'Missing token parameter'}});
    }
    Contestant.findOne({token: request.query.token}).exec((error, contestant) => {
      if (error || contestant === null) {
        return response.status(400).json({
          success: false,
          error: {text: 'Error while validating token'}
        });
      }
      if (contestant.activated === false) {
        contestant.activated = true;
        contestant.save();
      }
      response.writeHead(301, {Location: `${config.get('webserver:defaultProtocol')}://${config.get('webserver:url')}/list`});
      return response.end();
    });
  }

  static invalidate(request, response) {
    if (request.query.token === undefined) {
      return response.status(400).json({success: false,
        error: {text: 'Missing token parameter'}});
    }
    if (request.query.firstName === undefined) {
      return response.status(400).json({success: false,
        error: {text: 'Missing firstName parameter'}});
    }
    if (request.query.lastName === undefined) {
      return response.status(400).json({success: false,
        error: {text: 'Missing lastName parameter'}});
    }
    const {token, firstName, lastName} = request.body;

    Contestant.remove({token,
      firstName,
      lastName}, (error) => {
      if (error) {
        return response.status(200).json({success: false,
          error: {text: 'Error while deleting your entry'}});
      }
      return response.status(200).json({success: true});
    });
  }
};
