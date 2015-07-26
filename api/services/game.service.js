'use strict';

var request = require('request-promise');
var async   = require('async');
var Promise = require('bluebird');
var ld      = require('lodash');
var moment  = require('moment');
var config  = require('config');
var log     = require(global.ROOT_DIR + '/config/logger').subLog('game');

log.debug('game service');

// var steamKey = {
//   key: config.steam_api.api_key
// };

module.exports = new GameService();

function GameService() {

}

// Get news for gameid
//
// http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?
//    appid=440&count=3&maxlength=300&format=json
//
GameService.prototype.getNews = function (id) {
  var deferred = Promise.defer();

  var query = {
    appid: id,
    count: 4,
    maxlength: 300
  };

  request.get({
    url: config.steam_url + 'ISteamNews/GetNewsForApp/v0002',
    json: true,
    qs: query
  })
  .then(function (data) {
    var data = data.appnews;
    data.count = data.newsitems.length;

    data.newsitems = ld.map(data.newsitems, function (newsItem) {
      newsItem.date = moment.unix(newsItem.date).utc().format();
      return newsItem;
    });

    deferred.resolve(data);
  })
  .catch(function (err) {
    deferred.reject(err);
  });

  return deferred.promise;
};
