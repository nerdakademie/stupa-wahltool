'use strict';

const Vote = require('../../../../db').model('Vote');

module.exports = class VoteResultApiController {

  static basicResults(request, response) {
    Vote.aggregate([
      {$unwind: '$contestantIDs'},
      {$group: {_id: '$contestantIDs',
        votes: {$sum: 1}}},
      {$project: {_id: 0,
        contestantID: '$_id',
        votes: 1}},
      {$lookup: {from: 'contestants',
        localField: 'contestantID',
        foreignField: '_id',
        as: 'contestant'}},
      {$match: {contestant: {$ne: []}}},
      {$unwind: '$contestant'},
      {$project: {votes: 1,
        firstName: '$contestant.firstName',
        lastName: '$contestant.lastName'}},
      {$sort: {votes: -1}}
    ]).exec()
        .then((result) => {
          return response.json(result);
        })
        .catch(() => {
          return response.status(500).json({success: false,
            error: {text: 'Datenbankfehler'}});
        });
  }
};
