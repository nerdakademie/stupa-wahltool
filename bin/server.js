#!/usr/bin/env node
const config = require('../src/server/config');
const debug = require('debug');
const mongo = require('../src/server/db');

mongo.setupConnection().then(() => {
  const app = require('../src/server/app');
  app.set('port', config.get('webserver:port'));

  const server = require('http').createServer(app);
  server.listen(config.get('webserver:port'));
  server.on('error', (error) => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    switch (error.code) {
      case 'EACCES':
        throw new Error(`Port ${config.get('webserver:port')} requires elevated privileges`);
      case 'EADDRINUSE':
        throw new Error(`Port ${config.get('webserver:port')} is already in use`);
      default:
        throw error;
    }
  });
  server.on('listening', () => {
    // TODO get this value from ${config.rootPath}
    debug('Stupa-Wahltool:server')(`Listening on port ${server.address().port}`);
  });
}).catch((error) => {
  console.log(error);
  throw error;
});
