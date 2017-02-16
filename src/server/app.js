'use strict';

require('./model/models');

const morgan = require('morgan');
const config = require('./config');
const compression = require('compression');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const StaticRoutes = require('./routes/static');
const Routes = require('./routes/routes');
const express = require('express');

const app = express();
app.disable('x-powered-by');
app.enable('strict routing');

app.set('view engine', 'pug');
app.use(compression({level: 9}));
app.set('views', `${__dirname}/../../resources/server/view`);
app.use(favicon(`${__dirname}/../../resources/server/public/favicon.ico`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(new StaticRoutes());
app.use(new Routes());
module.exports = app;
