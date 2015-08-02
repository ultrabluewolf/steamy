'use strict';

var request = require('request-promise');
var async   = require('async');
var Promise = require('bluebird');
var ld      = require('lodash');
var moment  = require('moment');
var config  = require('config');

var redis   = require('../../config/redis');
var log     = require('../../config/logger').subLog('game');

var gameService = require('../services').games;

log.debug('game model');

module.exports = Game;

var KEY = 'gametitle:id';

function Game(appId, gameTitle) {
  if (!appId || !gameTitle) {
    throw new Error('app id and game title are required!');
  }

  this.app_id = appId + "";
  this.game_title = gameTitle.trim().toLowerCase();
}

// save object to store
//
Game.prototype.save = function () {
  var self = this;
  var deferred = Promise.defer();

  redis.hset(KEY, self.game_title, self.app_id)
    .then(function () {
      deferred.resolve(self);
    });

  return deferred.promise;
};

// fetch game object from store
//
Game.getByTitle = function (gameTitle) {
  var deferred = Promise.defer();
  gameTitle = gameTitle.trim().toLowerCase();

  redis.hget(KEY, gameTitle).then(function (appId) {
    var game;

    try {
      game = new Game(appId, gameTitle);
    } catch (ex) {
      return deferred.reject(ex);
    }

    deferred.resolve(game);
  });

  return deferred.promise;
};

// get all game objects
//
Game.all = function () {
  var deferred = Promise.defer();

  redis.hgetall(KEY).then(function (mappings) {
    var games = ld.map(ld.keys(mappings), function (gameTitle) {
      var appId = mappings[gameTitle];
      return new Game(appId, gameTitle);
    });

    deferred.resolve(games);
  });

  return deferred.promise;
};

// get number of all games stored
//
Game.count = function () {
  var deferred = Promise.defer();

  redis.hlen(KEY).then(function (count) {
    deferred.resolve(count);
  });

  return deferred.promise;
};
