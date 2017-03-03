'use strict';

const mongo = require('../../../db');
const Vote = mongo.model('Vote');
const SendVote = mongo.model('SendVote');
const Student = mongo.model('Student');
const VoteHelper = require('../../../helper/voteHelper');
const StringHelper = require('../../../helper/stringHelper');

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

    // convert ids to objectIDs
    const contestantObjectIDs = [];
    for (const id of contestantIDs) {
      contestantIDs.push(new mongo.Types.ObjectId(id));
    }

    Vote.findOne({token}).exec()
        .then((vote) => {
          if (vote === null) {
            return response.status(200).json({success: false,
              error: {text: 'Token nicht in der Datenbank gefunden'}});
          }

          if (vote.contestantIDs.length > 0) {
            for (const id of vote.contestantIDs) {
              if (contestantObjectIDs.indexOf(id) === -1) {
                return response.status(200).json({
                  success: false,
                  error: {text: 'Die Wahl bereits gewählter Bewerber kann nicht verändert werden'}
                });
              }
            }
          }

          vote.contestantIDs = contestantObjectIDs;
          vote.save();
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

};
