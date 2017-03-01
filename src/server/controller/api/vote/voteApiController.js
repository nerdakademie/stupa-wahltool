'use strict';

const Vote = require('../../../db').model('Vote');
const SendVote = require('../../../db').model('SendVote');
const Student = require('../../../db').model('Student');
const VoteHelper = require('../../../helper/voteHelper');
const StringHelper = require('../../../helper/stringHelper');

module.exports = class VoteApiController {

  static findOne(request, response) {
    const {token} = request.params;

    if (StringHelper.isNullOrEmptyString(token)) {
      return response.status(400).json({success: false,
        error: {text: 'Es wurden nicht alle notwendingen Felder ausgefüllt'}});
    }

    Vote.findOne({token}).select('-token -__v -_id').lean().exec((error, vote) => {
      if (error) {
        return next(error);
      }
      if (vote === null) {
        return response.status(400).json({success: false,
          error: {text: 'Keine Daten gefunden'}});
      }
      return response.json(vote.contestantIDs);
    });
  }

  static save(request, response) {
    const {token, contestantIDs} = request.body;

    if (StringHelper.isNullOrEmptyString(token) ||
        StringHelper.isNullOrEmptyString(contestantIDs)) {
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

    Vote.findOne({token}).exec((error, vote) => {
      if (error) {
        return response.status(500).json({success: false,
          error: {text: 'Fehler beim Bearbeiten aufgetreten'}});
      }
      if (vote === null) {
        return response.status(200).json({success: false,
          error: {text: 'Token nicht in der Datenbank gefunden'}});
      }

      if (vote.contestantIDs.length > 0) {
        for (const id of contestantIDs) {
          if (vote.contestantIDs.indexOf(id) === -1) {
            return response.status(200).json({
              success: false,
              error: {text: 'Die Wahl bereits gewählter Bewerber kann nicht verändert werden'}
            });
          }
        }
      }

      vote.contestantIDs = contestantIDs;
      vote.save();
      return response.status(200).json({success: true});
    });
  }

  static sendVoteTokens(request, response) {
    const {authToken} =  request.body;
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

      let failed = [];

      Student.find().select('firstName email').exec((error2, students) => {
        if (error2) {
          return response.status(500).json({success: false,
            error: {text: 'Fehler beim Bearbeiten aufgetreten'}});
        }
        const promises = VoteHelper.sendVoteMailWithPromise(students);

        Promise.all(promises).then((result) => {
          console.log('result: ' +result);
          if (result !== undefined) {
            failed.push(result);
          }
          return response.status(200).json({success: true});
        }).catch((promiseError) => {
          return response.status(200).json({success: false,
            error: {text: promiseError}});
        });

        if (failed.length > 0) {
          return response.status(200).json({success: false,
            error: {emails: failed}});
        }

      });
    });
  }

};
