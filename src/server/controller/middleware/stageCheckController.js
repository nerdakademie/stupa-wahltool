'use strict';

const Stage = require('../../db').model('Stage');

module.exports = class StageCheckController {

  static checkCandidationStage(request, response, next) {
    Stage.findOne({name: 'candidation'}).exec((error, stage) => {
      if (error) {
        return response.status(500).json({
          success: false,
          error: {text: 'Fehler bei der Überprüfung der Phase'}
        });
      }
      if (stage === null) {
        return response.status(500).json({
          success: false,
          error: {text: 'Keine Aufstellungsphase gefunden'}
        });
      }
      const currentDate = new Date();
      if (currentDate > stage.endTime) {
        return response.status(400).json({
          success: false,
          error: {text: 'Die Aufstellungsphase ist vorrüber'}
        });
      } else if (currentDate < stage.startTime) {
        return response.status(400).json({
          success: false,
          error: {text: 'Die Aufstellungsphase hat noch nicht begonnen'}
        });
      }
      return next();
    });
  }

  static checkVotingStage(request, response, next) {
    Stage.findOne({name: 'voting'}).exec((error, stage) => {
      if (error) {
        return response.status(500).json({
          success: false,
          error: {text: 'Fehler bei der Überprüfung der Phase'}
        });
      }
      if (stage === null) {
        return response.status(500).json({
          success: false,
          error: {text: 'Keine Abstimmungsphase gefunden'}
        });
      }
      const currentDate = new Date();
      if (currentDate > stage.endTime) {
        return response.status(400).json({
          success: false,
          error: {text: 'Die Wahlphase ist vorrüber'}
        });
      } else if (currentDate < stage.startTime) {
        return response.status(400).json({
          success: false,
          error: {text: 'Die Wahlphase hat noch nicht begonnen'}
        });
      }
      return next();
    });
  }

  static checkAfterVotingStage(request, response, next) {
    Stage.findOne({name: 'voting'}).exec((error, stage) => {
      if (error) {
        return response.status(500).json({
          success: false,
          error: {text: 'Fehler bei der Überprüfung der Phase'}
        });
      }
      if (stage === null) {
        return response.status(500).json({
          success: false,
          error: {text: 'Keine Abstimmungsphase gefunden'}
        });
      }
      const currentDate = new Date();
      if (currentDate < stage.endTime) {
        return response.status(200).json({
          success: false,
          error: {text: 'Die Wahlphase ist noch nicht vorrüber'}
        });
      }
      return next();
    });
  }
};
