'use strict';

const Contestant = require('../../../db').model('Contestant');
const StudentApiController = require('../student/studentApiController');
const xss = require('xss');
const fs = require('fs');
const ContestantHelper = require('../../../helper/contestantHelper');
const StringHelper = require('../../../helper/stringHelper');
const config = require('../../../config');

module.exports = class ContestantApiController {

  static getAll(request, response, next) {
    Contestant.find({activated: 1}).select('-token -__v -activated -course -year').lean().exec((error, contestants) => {
      if (error) {
        return next(error);
      }
      return response.json(contestants);
    });
  }

  static getSingle(request, response, next) {
    const {firstName, lastName, token} = request.query;
    if (StringHelper.isNullOrEmptyString(firstName) ||
        StringHelper.isNullOrEmptyString(lastName) ||
        StringHelper.isNullOrEmptyString(token)) {
      return response.status(400).json({success: false,
        error: {text: 'Es wurden nicht alle notwendingen Felder ausgefüllt'}});
    }

    Contestant.findOne({activated: 1,
      firstName,
      lastName,
      token}, 'description image').exec((error, contestant) => {
        if (error) {
          return next(error);
        }
        if (contestant === null) {
          return response.status(200).json({success: false,
            error: {text: 'Es wurde kein Bewerber mit diesen Angaben gefunden'}});
        }
        return response.json(contestant);
      });
  }

  static edit(request, response) {
    if (StringHelper.isNullOrEmptyString(request.body.firstName) ||
        StringHelper.isNullOrEmptyString(request.body.lastName) ||
        StringHelper.isNullOrEmptyString(request.body.token) ||
        StringHelper.isNullOrEmptyString(request.body.description)) {
      return response.status(400).json({success: false,
        error: {text: 'Es wurden nicht alle notwendingen Felder ausgefüllt'}});
    }

    const {firstName, lastName, token, description} = request.body;

    Contestant.find({firstName,
      lastName,
      token}).exec((error, contestants) => {
        if (error) {
          return response.status(500).json({success: false,
            error: {text: 'Fehler beim Bearbeiten aufgetreten'}});
        }
        if (contestants.length !== 1) {
          return response.status(200).json({success: false,
            error: {text: 'Bewerber nicht eindeutig identifizierbar'}});
        }
        const [contestant] = contestants;
        if (request.file !== undefined) {
          if (fs.existsSync(`../../../../../resources/server/public/img/${contestant.image}`)) {
            fs.unlink(request.file.path, (error2) => {
              if (error) {
                console.log(error2);
              }
            });
          }
          contestant.image = request.file.filename;
        }
        contestant.description = xss(description);

        contestant.save();
        return response.status(200).json({success: true});
      });
  }

  static save(request, response) {
    if (StringHelper.isNullOrEmptyString(request.body.firstName) ||
        StringHelper.isNullOrEmptyString(request.body.lastName) ||
        StringHelper.isNullOrEmptyString(request.body.course) ||
        StringHelper.isNullOrEmptyString(request.body.year) ||
        StringHelper.isNullOrEmptyString(request.body.description) ||
        request.file === undefined) {
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

            ContestantHelper.sendActivationMail(contestantJSON, student)
                .then(() => {
                  return response.status(200).json({success: true});
                })
                .catch(() => {
                  return response.status(200).json({
                    success: false,
                    error: {text: 'Fehler beim Versand der Bestätigungsmail'}
                  });
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
        });
      });
  }

  static activate(request, response) {
    if (StringHelper.isNullOrEmptyString(request.query.token)) {
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
    if (StringHelper.isNullOrEmptyString(request.query.token)) {
      return response.status(400).json({success: false,
        error: {text: 'Missing token parameter'}});
    }
    if (StringHelper.isNullOrEmptyString(request.query.firstName)) {
      return response.status(400).json({success: false,
        error: {text: 'Missing firstName parameter'}});
    }
    if (StringHelper.isNullOrEmptyString(request.query.lastName)) {
      return response.status(400).json({success: false,
        error: {text: 'Missing lastName parameter'}});
    }
    const {token, firstName, lastName} = request.query;

    Contestant.findOneAndRemove({token,
      firstName,
      lastName,
      activated: false}).exec((error, contestant) => {
        if (error || contestant === null) {
          return response.status(200).json({success: false,
            error: {text: 'Error while deleting your entry'}});
        }

        if (fs.existsSync(`resources/server/public/img/${contestant.image}`)) {
          fs.unlink(`resources/server/public/img/${contestant.image}`, (error2) => {
            if (error) {
              console.log(error2);
            }
          });
        }
        response.writeHead(301, {Location: `${config.get('webserver:defaultProtocol')}://${config.get('webserver:url')}/list`});
        return response.end();
      });
  }
};
