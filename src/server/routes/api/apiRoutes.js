'use strict';

const Express = require('express');
const ContestantApiRoutes = require('./contestant/contestantApiRoutes');
const StudentApiRoutes = require('./student/studentApiRoutes');
const VoteApiRoutes = require('./vote/voteApiRoutes');

module.exports = class ApiRoutes extends Express.Router {
  constructor() {
    super();
    this.use('/contestants', new ContestantApiRoutes());
    this.use('/students', new StudentApiRoutes());
    this.use('/votes', new VoteApiRoutes());
  }
};
