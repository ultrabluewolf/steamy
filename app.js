'use strict';

global.APP_NAME = require('./package.json').name;
global.ROOT_DIR = __dirname;
global.DEBUG    = process.env.NODE_DEBUG;

var express = require('express');
var app     = express();
var log     = require('./config/logger').create();

var config = require('config');
var port   = process.env.PORT || config.port;

var controllers = require('./api/controllers');

// assets
app.use('/dist', express.static('dist'));

app.get('/', function (req, res) {
  res.send("Yes. I'm alive.");
});

// api routing
app.use('/api', controllers);

// starting the server
//
var server = app.listen(port, function () {
  log.info('Steamy listening at %s', port);
});
