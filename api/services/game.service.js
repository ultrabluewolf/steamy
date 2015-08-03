'use strict';

var request = require('request-promise');
var async   = require('async');
var Promise = require('bluebird');
var cheerio = require('cheerio');
var ld      = require('lodash');
var moment  = require('moment');
var config  = require('config');
var log     = require('../../config/logger').subLog('game');

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
  if (!id) {
    throw new Error('id required!');
  }
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

// get metadata for requested appid
//
GameService.prototype.get = function (id) {
  if (!id) {
    throw new Error('id required!');
  }
  var deferred = Promise.defer();

  request.get({
    url: config.steam_store_url.games + id,
    jar: generateJarForStorePage()
  })
  .then(function (data) {
    var game = {};
    var $ = cheerio.load(data);

    var TITLE = '.apphub_AppName';
    var IMG   = '.game_header_image_ctn img';
    var DESC  = '.game_description_snippet';
    var DATE  = '.release_date .date';
    var TAGS  = '.popular_tags a';

    game.title        = $(TITLE).text();
    game.img          = $(IMG).attr('src');
    game.release_date = $(DATE).text();
    game.description  = $(DESC).text().trim();
    game.tags         = [];
    game.store_page   = config.steam_store_url.games + id;

    game.release_date = moment(game.release_date).utc().format();

    $(TAGS).each(function () {
      game.tags.push($(this).text().trim());
    });
    game.tags = game.tags.splice(0, 5);

    deferred.resolve(game);
  })
  .catch(function (err) {
    deferred.reject(err);
  });

  return deferred.promise;
};

GameService.prototype.toAppId = function (title) {
  if (!title) {
    throw new Error('title required!');
  }
  var deferred = Promise.defer();

  var query = {
    term: title
  };

  request.get({
    url: config.steam_store_url.search,
    qs: query
  })
  .then(function (data) {
    var game = {};
    var $ = cheerio.load(data);

    //var searchResults = [];
    //var containers = $("#search_result_container a");
    // containers.each(function (i) {
    //   searchResults.push($(this));
    // });
    
    // var row = ld.find(searchResults, function (searchResult) {
    //   var t = searchResult.find('.search_name').text().toLowerCase().trim();
    //   console.log(t);
    //   return searchResult.find('.search_name').text().toLowerCase().trim() === title;
    // });
    // console.log(row);

    var containers = $("#search_result_container a");
    var searchResult = containers.first();

    var storePage = searchResult.attr('href');
    var matched = storePage.match(/\/app\/([0-9]+)/);

    if (matched) {
      game.app_id = matched[1];
      game.game_title = searchResult.find('.search_name').text().toLowerCase().trim();
      game.query = title;

    } else {
      return deferred.reject(new Error('match not found'));
    }

    deferred.resolve(game);
  })
  .catch(function (err) {
    deferred.reject(err);
  });

  return deferred.promise;
};

// cookie helper for app pages
//
function generateJarForStorePage() {
  var url = 'http://store.steampowered.com';
  var jar = request.jar();

  var cookies = [
    request.cookie('lastagecheckage="1-January-1915"'),
    request.cookie('birthtime="' + moment('01/01/1915', 'MM/dd/yyyy').unix() + '"')
  ];
  
  jar.setCookie(cookies[0], url);
  jar.setCookie(cookies[1], url);;

  return jar;
}
