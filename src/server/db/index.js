'use strict';

const mongoose = require('mongoose');
const config = require('../config');
//const {logger: log} = require('turing-logging');

class TuringMongo extends mongoose.Mongoose {
  setupConnection() {
    return new Promise((resolve, reject) => {
      const host = config.get('mongo:host');
      const port = config.get('mongo:port');
      const db = config.get('mongo:db');
      const user = config.get('mongo:user');
      const password = config.get('mongo:password');

      const userAndPassword = user && password ? `${user}:${password}@` : '';
      const uri = `mongodb://${userAndPassword}${host}:{port}/${db}`;

    //  log.info(`Mongoose connecting to ${host}`);
      this.connect(uri);

      this.connection.on('connected', () => {
      //  log.info(`Mongoose default connection open to ${host}`);
        resolve();
      });

      this.connection.on('error', (error) => {
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

module.exports = new TuringMongo();
