'use strict';

var Redis  = require('ioredis');
var config = require('config');
var log     = require('../config/logger').subLog('redis');

var redis = module.exports = new Redis(config.redis);

redis.on('connect', function () {
  log.debug('redis connection established');
});

redis.on('error', function () {
  log.debug('redis connection issues');
});
