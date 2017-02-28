'use strict';

const Vote = require('../../../db').model('Vote');

module.exports = class VoteApiController {

  static find(request, response, next) {
    Vote.find().select('-__v -_id').lean().exec((error, votes) => {
      if (error) {
        return next(error);
      }
      return response.json(votes);
    });
  }

  static findOne(request, response) {
    const {token} = request.params;

    if (token === undefined) {
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

    if (token === undefined && contestantIDs === undefined) {
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

    Vote.findOneAndUpdate({token}, {contestantIDs}, (error, vote) => {
      if (error) {
        return response.status(500).json({success: false,
          error: {text: 'Fehler beim Bearbeiten aufgetreten'}});
      }
      if (vote === null) {
        return response.status(200).json({success: false,
          error: {text: 'Token nicht in der Datenbank gefunden'}});
      }


      return response.status(200).json({success: true});
    });
  }

};
