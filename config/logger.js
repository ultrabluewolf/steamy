'use strict';

var bunyan = require('bunyan');
var ld     = require('lodash');

var Logger = module.exports = {};

var streams = [
  {
    stream: process.stdout,
    level: 'info'
  }
];

if (global.DEBUG) {
  ld.find(streams, {level: 'info'}).level = 'debug';
}

Logger.create = function (module) {
  return bunyan.createLogger({
    name: module || global.APP_NAME,
    streams: streams
  });
};

Logger.subLog = function (component) {
  return Logger.create().child({component: component});
};
