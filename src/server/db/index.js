'use strict';

const mongoose = require('mongoose');
mongoose.Promise = Promise;
const config = require('../config');

class Mongo extends mongoose.Mongoose {
  setupConnection() {
    return new Promise((resolve, reject) => {
      const host = config.get('mongo:host');
      const port = config.get('mongo:port');
      const db = config.get('mongo:db');
      const user = config.get('mongo:user');
      const pass = config.get('mongo:password');
      const uri = `mongodb://${host}:${port}/${db}`;

      if (user !== undefined && pass !== undefined) {
        this.connect(uri, {user, pass});
      } else {
        this.connect(uri);
      }

      this.connection.on('connected', () => {
      //  log.info(`Mongoose default connection open to ${host}`);
        console.log('connected');
        resolve();
      });

      this.connection.on('error', (error) => {
        console.log('error');
        reject(error);
      });

      this.connection.on('disconnected', () => {
        //log.info('Mongoose default connection disconnected');
      });

      const gracefulExit = () => {
        this.connection.close(() => {
          //log.info('Mongoose default connection disconnected through app termination');
          process.exit(0); // eslint-disable-line no-process-exit
        });
      };
      process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);
    });
  }
}

module.exports = new Mongo();
