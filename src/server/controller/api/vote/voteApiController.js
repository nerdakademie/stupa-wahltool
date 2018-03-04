'use strict';

const mongo = require('../../../db');
const mongoose = require('mongoose');
const Vote = mongo.model('Vote');
const Token = mongo.model('Token');
const SendVote = mongo.model('SendVote');
const Student = mongo.model('Student');
const VoteHelper = require('../../../helper/voteHelper');
const StringHelper = require('../../../helper/stringHelper');
const uuid = require('uuid/v4');

module.exports = class VoteApiController {
  static findOne(request, response) {
    const {token} = request.params;

    if (StringHelper.isNullOrEmptyString(token)) {
      return response.status(400).json({success: false,
        error: {text: 'Es wurden nicht alle notwendingen Felder ausgefüllt'}});
    }

    Token.findOne({token}).select('-token -__v -_id -studentEmail')
      .lean()
      .exec()
      .then((vote) => {
        if (vote === null) {
          return response.status(200).json({success: false,
            error: {text: 'Keine Daten gefunden'}});
        }
        return response.json(vote.voted);
      })
      .catch(() => {
        return response.status(500).json({success: false,
          error: {text: 'Datenbankfehler'}});
      });
  }

  static save(request, response) {
    const {token, contestantIDs} = request.body;

    if (StringHelper.isNullOrEmptyString(token) ||
        contestantIDs === undefined) {
      return response.status(400).json({success: false,
        error: {text: 'Es wurden nicht alle notwendingen Felder ausgefüllt'}});
    }

    if (contestantIDs.length < 1) {
      return response.status(200).json({success: false,
        error: {text: 'Es muss mindestens ein Bewerber gewählt werden'}});
    }

    if (contestantIDs.length > 4) {
      return response.status(200).json({success: false,
        error: {text: 'Es dürfen nur maximal 4 Bewerber gewählt werden'}});
    }

    if (contestantIDs.length !== new Set(contestantIDs).size) {
      return response.status(200).json({success: false,
        error: {text: 'Bewerber mehrfach gewählt'}});
    }

    Token.findOne({token}).exec()
      .then((token) => {
        if (token === null) {
          return response.status(200).json({success: false,
            error: {text: 'Token nicht in der Datenbank gefunden'}});
        }

        // check if token was already used
        if (token.voted) {
          return response.status(400).json({
            success: false,
            error: {text: 'Du hast bereits gewählt'}
          });
        }
        token.voted = true;
        token.save((saveError) => {
          if (saveError) {
            return response.status(500)
              .json({
                success: false,
                error: {text: 'Interner Serverfehler. Stimmen gespeichert, Token allerdings nicht modifiziert. Bitte schreibe uns eine E-Mail und erwähne deinen RevocationToken: ${revocationToken}'}
              });
          }
        });
        Student.findOne({email: token.studentEmail}).exec()
          .then((student) => {
            const revocationToken = uuid();
            for (const id of contestantIDs) {
              const vote = new Vote({
                voterCourse: student.course,
                voterYear: student.year,
                contestantID: id,
                oldID: id,
                revocationToken
              });
              vote.save((saveError) => {
                if (saveError) {
                  return response.status(500)
                    .json({
                      success: false,
                      error: {text: 'Interner Serverfehler. Stimmen wurden nicht oder nur teilweise gespeichert. Bitte schreibe uns eine E-Mail und erwähne deinen RevocationToken: ${revocationToken}'}
                    });
                }
              });
            }
            return response.status(200).json({success: true});
          });
      })
      .catch(() => {
        return response.status(500).json({success: false,
          error: {text: 'Datenbankfehler'}});
      });
  }

  static sendVoteTokens(request, response) {
    request.socket.setTimeout(3600e3);
    const {authToken} = request.body;
    if (StringHelper.isNullOrEmptyString(authToken)) {
      return response.status(400).json({
        success: false,
        error: {text: 'Es wurden nicht alle notwendingen Felder ausgefüllt'}
      });
    }

    SendVote.findOne({token: authToken}).exec((error, sendVote) => {
      if (error) {
        return response.status(500).json({
          success: false,
          error: {text: 'Fehler beim Bearbeiten aufgetreten'}
        });
      }

      if (sendVote === null) {
        return response.status(200).json({
          success: false,
          error: {text: 'Token nicht in der Datenbank gefunden'}
        });
      }

      Student.find().select('firstName email')
        .exec()
        .then((students) => {
          const promises = VoteHelper.sendVoteMailWithPromise(students);

          Promise.all(promises)
            .then(() => {
              return response.status(200).json({success: true});
            })
            .catch((promiseError) => {
              return response.status(200).json({
                success: false,
                error: {text: promiseError}
              });
            });
        })
        .catch(() => {
          return response.status(500).json({
            success: false,
            error: {text: 'Fehler beim Bearbeiten aufgetreten'}
          });
        });
    });
  }

  static sendMissingVoteTokens(request, response) {
    request.socket.setTimeout(3600e3);
    const {authToken} = request.body;
    if (StringHelper.isNullOrEmptyString(authToken)) {
      return response.status(400).json({
        success: false,
        error: {text: 'Es wurden nicht alle notwendingen Felder ausgefüllt'}
      });
    }

    SendVote.findOne({token: authToken}).exec((error, sendVote) => {
      if (error) {
        console.log(error);
        return response.status(500).json({
          success: false,
          error: {text: 'Fehler beim Bearbeiten aufgetreten'}
        });
      }

      if (sendVote === null) {
        return response.status(200).json({
          success: false,
          error: {text: 'Token nicht in der Datenbank gefunden'}
        });
      }
      Student.aggregate([
        {$project: {firstName: 1,
          email: 1}},
        {$lookup: {from: 'tokens',
          localField: 'email',
          foreignField: 'studentEmail',
          as: 'tokenHolder'}},
        {$match: {tokenHolder: {$eq: []}}}
      ]).exec()
        .then((studentsMissingTokens) => {
          const promises = VoteHelper.sendVoteMailWithPromise(studentsMissingTokens);

          Promise.all(promises)
            .then(() => {
              return response.status(200).json({success: true});
            })
            .catch((promiseError) => {
              return response.status(200).json({
                success: false,
                error: {text: promiseError}
              });
            });
        })
        .catch((error) => {
          console.log(error);
          return response.status(500).json({
            success: false,
            error: {text: 'Fehler beim Bearbeiten aufgetreten'}
          });
        });
    });
  }

  static findTokenByEmail(request, response) {
    const {authToken, email} = request.body;
    if (StringHelper.isNullOrEmptyString(authToken) ||
            StringHelper.isNullOrEmptyString(email)) {
      return response.status(400).json({success: false,
        error: {text: 'Es wurden nicht alle notwendingen Felder ausgefüllt'}});
    }
  }
};
