'use strict';

var chai    = require('chai');
var assert  = chai.assert;
var rewire  = require('rewire');
var Promise = require('bluebird');
var moment  = require('moment');
var ld      = require('lodash');
var testUtils = require('../utils');
var newsMock  = require('./mock/getNewsForApp');

testUtils.configureEnv();

var gameService    = rewire('../../api/services/game.service');
//var gameController = rewire('../../api/controllers/game.controller');

var requestPromMock = {
  get: function () {
    var deferred = Promise.defer();
    deferred.resolve(testUtils.deepCopy(newsMock));
    return deferred.promise;
  }
};

describe('GameService', function () {

  describe('#getNews', function () {

    beforeEach(function () {
      gameService.__set__('request', requestPromMock);
    });

    it('should require a parameter', function () {
      try {
        gameService.getNews();
      } catch (ex) {
        assert.ok(ex);
        return;
      }
      assert.ok(null);
    });

    it('should contain count of items returned', function () {
      gameService.getNews(123123).then(function (data) {
        assert.equal(newsMock.appnews.newsitems.length, data.count);
      });
    });

    it('should contain date string', function () {
      gameService.getNews(123123).then(function (data) {
        assert.ok(moment(data.newsitems[0].date).isValid());
      });
    });

  });

});
