'use strict';

const mongo = require('../../../db');
const Vote = mongo.model('Vote');
const SendVote = mongo.model('SendVote');
const Student = mongo.model('Student');
const VoteHelper = require('../../../helper/voteHelper');
const StringHelper = require('../../../helper/stringHelper');
const bcrypt = require('bcrypt');
const saltRounds = 12;

module.exports = class VoteApiController {

  static findOne(request, response) {
    const {token} = request.params;

    if (StringHelper.isNullOrEmptyString(token)) {
      return response.status(400).json({success: false,
        error: {text: 'Es wurden nicht alle notwendingen Felder ausgefüllt'}});
    }

    Vote.findOne({token}).select('-token -__v -_id -studentEmail')
        .lean()
        .exec()
        .then((vote) => {
          if (vote === null) {
            return response.status(200).json({success: false,
              error: {text: 'Keine Daten gefunden'}});
          }
          return response.json(vote.contestantIDs);
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

    Vote.findOne({token}).exec()
        .then((vote) => {
          if (vote === null) {
            return response.status(200).json({success: false,
              error: {text: 'Token nicht in der Datenbank gefunden'}});
          }

          if (vote.contestantIDs.length > 0) {
            for (const id of vote.contestantIDs) {
              if (contestantIDs.indexOf(id.toString()) === -1) {
                return response.status(200).json({
                  success: false,
                  error: {text: 'Die Wahl bereits gewählter Bewerber kann nicht verändert werden'}
                });
              }
            }
          }

          if (vote.contestantIDs.length !== contestantIDs.length) {
            vote.contestantIDs = contestantIDs;
            vote.save();
          }

          return response.status(200).json({success: true});
        })
        .catch(() => {
          return response.status(500).json({success: false,
            error: {text: 'Datenbankfehler'}});
        });
  }

  static sendVoteTokens(request, response) {
    const {authToken} = request.body;
    if (StringHelper.isNullOrEmptyString(authToken)) {
      return response.status(400).json({success: false,
        error: {text: 'Es wurden nicht alle notwendingen Felder ausgefüllt'}});
    }

    SendVote.findOne({token: authToken}).exec((error, sendVote) => {
      if (error) {
        return response.status(500).json({success: false,
          error: {text: 'Fehler beim Bearbeiten aufgetreten'}});
      }

      if (sendVote === null) {
        return response.status(200).json({success: false,
          error: {text: 'Token nicht in der Datenbank gefunden'}});
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
                  return response.status(200).json({success: false,
                    error: {text: promiseError}});
                });
          })
          .catch(() => {
            return response.status(500).json({success: false,
              error: {text: 'Fehler beim Bearbeiten aufgetreten'}});
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

    SendVote.findOne({token: authToken}).exec()
        .then((sendVote) => {
          if (sendVote === null) {
            return response.status(200).json({success: false,
              error: {text: 'Token nicht in der Datenbank gefunden'}});
          }

          Vote.find().select('token studentEmail')
              .exec()
              .then((votes) => {
                for (const vote of votes) {
                  bcrypt.compare(email, vote.studentEmail).then((result) => {
                    if (result) {
                      return response.json(vote);
                    }
                  });
                }
                return response.status(200).json({success: false,
                  error: {text: 'Keinen Token zu dieser Email gefunden'}});
              })
              .catch(() => {
                return response.status(500).json({success: false,
                  error: {text: 'Datenbankfehler'}});
              });
        })
        .catch(() => {
          return response.status(500).json({success: false,
            error: {text: 'Auth Token Überprüfung fehlgeschlagen'}});
        });
  }

};
