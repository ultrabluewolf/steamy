'use strict';

var chai    = require('chai');
var assert  = chai.assert;
var rewire  = require('rewire');
var Promise = require('bluebird');
var moment  = require('moment');
var ld      = require('lodash');

var testUtils          = require('../utils');
var friendsMock        = require('./mock/getFriendList');
var ownedGamesMock     = require('./mock/getOwnedGames');
var playerSummaryMock  = require('./mock/getPlayerSummary');
var playerSummaryMock2 = require('./mock/getPlayerSummary2');
var mocks = {
  friends:  ld.extend(
    testUtils.deepCopy(playerSummaryMock2),
    testUtils.deepCopy(friendsMock)
  ),
  games:    ownedGamesMock,
  user:     playerSummaryMock
};

testUtils.configureEnv();

var userService    = rewire('../../api/services/user.service');
//var userController = rewire('../../api/controllers/user.controller');

function getRequestPromMock(type) {
  return {
    get: function () {
      var deferred = Promise.defer();
      deferred.resolve(testUtils.deepCopy(mocks[type]));
      return deferred.promise;
    }
  };
}

describe('UserService', function () {

  describe('#getById', function () {

    beforeEach(function () {
      userService.__set__('request', getRequestPromMock('user'));
    });

    it('should require a parameter', function () {
      try {
        userService.getById();
      } catch (ex) {
        assert.ok(ex);
        return;
      }
      assert.ok(null);
    });

    it('should contain count of items returned', function () {
      userService.getById(1234).then(function (data) {
        assert.equal(playerSummaryMock.response.players.length, data.count);
      });
    });

    it('should contain date strings', function () {
      userService.getById('1234').then(function (data) {
        assert.ok(moment(data.players[0].lastlogoff).isValid());
        assert.ok(moment(data.players[0].timecreated).isValid());
      });
    });

  });

  describe('#getGamesById', function () {

    beforeEach(function () {
      userService.__set__('request', getRequestPromMock('games'));
    });

    it('should require a parameter', function () {
      try {
        userService.getGamesById();
      } catch (ex) {
        assert.ok(ex);
        return;
      }
      assert.ok(null);
    });

    it('should contain count of items returned', function () {
      userService.getGamesById(1234).then(function (data) {
        assert.equal(ownedGamesMock.response.game_count, data.count);
      });
    });

    it('should contain date strings', function () {
      ownedGamesMock.response.games = ld.sortBy(ownedGamesMock.response.games, function (game) {
        return -game.playtime_forever;
      });

      userService.getGamesById('1234').then(function (data) {
        ld.forEach(testUtils.range(ownedGamesMock.response.game_count), function (i) {
          assert.include(data.games[i].urls.icon, ownedGamesMock.response.games[i].img_icon_url);
          assert.include(data.games[i].urls.logo, ownedGamesMock.response.games[i].img_logo_url);
        });
      });
    });

  });

  describe('#getFriendListById', function () {

    beforeEach(function () {
      userService.__set__('request', getRequestPromMock('friends'));
    });

    it('should require a parameter', function () {
      try {
        userService.getFriendListById();
      } catch (ex) {
        assert.ok(ex);
        return;
      }
      assert.ok(null);
    });

    it('should contain count of items returned', function () {
      userService.getFriendListById(1234).then(function (data) {
        assert.equal(friendsMock.friendslist.friends.length, data.count);
      });
    });

    it('should contain date strings', function () {
      userService.getFriendListById('1234').then(function (data) {
        ld.forEach(testUtils.range(friendsMock.friendslist.friends.length), function (i) {
          assert.ok(moment(data.friends[i].friend_since).isValid());
        });
      });
    });

    it('should contain player summary for friends', function () {
      userService.getFriendListById(1234).then(function (data) {
        ld.forEach(testUtils.range(friendsMock.friendslist.friends.length), function (i) {
          data.friends[i].summary.lastlogoff = moment(data.friends[i].summary.lastlogoff).unix();
          data.friends[i].summary.timecreated = moment(data.friends[i].summary.timecreated).unix();
          assert.deepEqual(playerSummaryMock2.response.players[i], data.friends[i].summary);
        });
      });
    });

  });

});
