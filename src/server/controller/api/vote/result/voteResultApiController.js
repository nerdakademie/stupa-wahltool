'use strict';

const Vote = require('../../../../db').model('Vote');
const Token = require('../../../../db').model('Token');

module.exports = class VoteResultApiController {
  static basicResults(request, response) {
    Vote.aggregate([
      {$group: {_id: '$contestantID',
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
    Token.aggregate([
      {$project: {_id: 1,
        votes: {$cond: ['$voted', 1, 0]}}},
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
          {$group: {_id: '$contestantID',
            votes: {$sum: 1}}},
          {$group: {_id: null,
            votes: {$sum: '$votes'}}},
          {$project: {_id: 0,
            votes: 1}},
          {$sort: {votes: -1}}
        ]).exec()
          .then((totalUsedVotes) => {
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

  static votesPerCourse(request, response) {
    Vote.aggregate([
      {$group: {_id: '$voterCourse',
        votes: {$sum: 1}}},
      {$project: {_id: 0,
        votes: 1,
        course: '$_id'}},
      {$sort: {votes: -1}}
    ]).exec()
      .then((voteCount) => {
        return response.json(voteCount);
      })
      .catch(() => {
        return response.status(500).json({success: false,
          error: {text: 'Datenbankfehler'}});
      });
  }

  static votesPerYear(request, response) {
    Vote.aggregate([
      {$group: {_id: '$voterYear',
        votes: {$sum: 1}}},
      {$project: {_id: 0,
        votes: 1,
        year: '$_id'}},
      {$sort: {votes: -1}}
    ]).exec()
      .then((voteCount) => {
        return response.json(voteCount);
      })
      .catch(() => {
        return response.status(500).json({success: false,
          error: {text: 'Datenbankfehler'}});
      });
  }

  static votesPerCourseAndYear(request, response) {
    Vote.aggregate([
      {$group: {_id: {
        year: '$voterYear',
        course: '$voterCourse'},
      votes: {$sum: 1}}},
      {$project: {_id: 0,
        votes: 1,
        course: '$_id.course',
        year: '$_id.year'}},
      {$sort: {votes: -1}}
    ]).exec()
      .then((voteCount) => {
        return response.json(voteCount);
      })
      .catch(() => {
        return response.status(500).json({success: false,
          error: {text: 'Datenbankfehler'}});
      });
  }

  static participationPerCourseAndYear(request, response) {
    Token.aggregate([
      {$project: {_id: 1,
        studentEmail: 1,
        votes: {$cond: ['$voted', 1, 0]}}},
      {$lookup: {from: 'students',
        localField: 'studentEmail',
        foreignField: 'email',
        as: 'student'}},
      {$match: {student: {$ne: []}}},
      {$unwind: '$student'},
      {$project: {votes: 1,
        course: '$student.course',
        year: '$student.year'}},
      {$group: {_id: {
        year: '$year',
        course: '$course'},
      votes: {$sum: '$votes'}}},
      {$project: {_id: 0,
        votes: 1,
        course: '$_id.course',
        year: '$_id.year'}},
      {$sort: {votes: -1}}
    ]).exec()
      .then((participation) => {
        return response.json(participation);
      })
      .catch(() => {
        return response.status(500).json({success: false,
          error: {text: 'Datenbankfehler'}});
      });
  }
};
