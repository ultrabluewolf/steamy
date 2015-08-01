'use strict';

var ld = require('lodash');

exports.configureEnv = function () {
  global.ROOT_DIR = '.';
  global.APP_NAME = require('../package.json').name;
};

exports.deepCopy = function (obj) {
  return JSON.parse(JSON.stringify(obj));
};

exports.range = function (n) {
  return ld.map(new Array(n), function (elm, i) {
    return i;
  });
};
