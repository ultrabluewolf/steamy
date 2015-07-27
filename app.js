'use strict';

global.APP_NAME = require('./package.json').name;
global.ROOT_DIR = __dirname;
global.DEBUG    = process.env.NODE_DEBUG;

var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var cons    = require('consolidate');
var log     = require('./config/logger').create();

var config = require('config');
var port   = process.env.PORT || config.port;

var controllers = require('./api/controllers');

// assets
app.use('/lib', express.static('bower_components'));
app.use('/dist', express.static('dist'));

// server-side templating
app.engine('ejs', cons.ejs);
app.set('view engine', 'ejs');
app.set('views', global.ROOT_DIR + '/views');
app.set('view cache', !global.DEBUG);

app.use(bodyParser.json());

// api routing
app.use('/api', controllers);

app.get('/', function (req, res) {
  res.render('index', {});
});

app.all('/*', function(req, res) {
  res.render('index', {});
});

// starting the server
//
var server = app.listen(port, function () {
  log.info('Steamy listening at %s', port);
});
