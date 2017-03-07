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
      {$sort: {votes: 1}}
    ]).exec()
        .then((result) => {
          return response.json(result);
        })
        .catch(() => {
          return response.status(500).json({success: false,
            error: {text: 'Datenbankfehler'}});
        });
  }

  static participation(request, response) {
    Vote.aggregate([
      {$project: {_id: 1,
        votes: {$cond: [{$gt: [{$size: '$contestantIDs'}, 0]}, 1, 0]}}},
      {$group: {_id: '$_id',
        voters: {$sum: 1},
        activeVoters: {$sum: '$votes'}}},
      {$project: {_id: 0,
        voters: 1,
        activeVoters: 1}},
      {$group: {_id: null,
        voters: {$sum: '$voters'},
        activeVoters: {$sum: '$activeVoters'}}},
      {$project: {_id: 0,
        voters: 1,
        activeVoters: 1,
        inactiveVoters: {$subtract: ['$voters', '$activeVoters']}}}
    ]).exec()
        .then((result) => {
          const [resultObject] = result;
          const {voters, activeVoters, inactiveVoters} = resultObject;
          const participation = activeVoters / voters * 100;
          return response.json({voters,
            activeVoters,
            inactiveVoters,
            participation});
        })
        .catch(() => {
          return response.status(500).json({success: false,
            error: {text: 'Datenbankfehler'}});
        });
  }

  static votesUsed(request, response) {
    Vote.aggregate([
      {$group: {_id: '$_id',
        voter: {$sum: 1}}},
      {$project: {_id: 0,
        voter: 1}},
      {$group: {_id: null,
        voters: {$sum: '$voter'}}},
      {$project: {_id: 0,
        votes: {$multiply: ['$voters', 4]}}}
    ]).exec()
        .then((totalAvailableVotes) => {
          Vote.aggregate([
            {$unwind: '$contestantIDs'},
            {$group: {_id: '$contestantIDs',
              votes: {$sum: 1}}},
            {$project: {_id: 0,
              votes: 1}},
            {$group: {_id: null,
              votes: {$sum: '$votes'}}},
            {$sort: {votes: -1}}
          ]).exec()
              .then((totalUsedVotes) => {
                console.log(totalUsedVotes);
                console.log(totalAvailableVotes);
                const [availableVotes] = totalAvailableVotes;
                const [usedVotes] = totalUsedVotes;
                const participation = usedVotes.votes / availableVotes.votes * 100;
                return response.json({usedVotes: usedVotes.votes,
                  availableVotes: availableVotes.votes,
                  participation});
              })
              .catch(() => {
                return response.status(500).json({success: false,
                  error: {text: 'Datenbankfehler'}});
              });
        })
        .catch(() => {
          return response.status(500).json({success: false,
            error: {text: 'Datenbankfehler'}});
        });
  }

  static votesPerVoter(request, response) {
    Vote.aggregate([
      {$project: {_id: 1,
        one: {$cond: [{$eq: [{$size: '$contestantIDs'}, 1]}, 1, 0]},
        two: {$cond: [{$eq: [{$size: '$contestantIDs'}, 2]}, 1, 0]},
        three: {$cond: [{$eq: [{$size: '$contestantIDs'}, 3]}, 1, 0]},
        four: {$cond: [{$eq: [{$size: '$contestantIDs'}, 4]}, 1, 0]}}},
      {$group: {_id: 'null',
        one: {$sum: '$one'},
        two: {$sum: '$two'},
        three: {$sum: '$three'},
        four: {$sum: '$four'}}},
      {$project: {_id: 0,
        one: 1,
        two: 1,
        three: 1,
        four: 1}}
    ]).exec()
      .then((voteCount) => {
        const [voteCountObject] = voteCount;
        const {one, two, three, four} = voteCountObject;
        return response.json({one,
          two,
          three,
          four});
      })
      .catch(() => {
        return response.status(500).json({success: false,
          error: {text: 'Datenbankfehler'}});
      });
  }
};
