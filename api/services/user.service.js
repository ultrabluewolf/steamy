'use strict';

var request = require('request-promise');
var async   = require('async');
var Promise = require('bluebird');
var ld      = require('lodash');
var moment  = require('moment');
var config  = require('config');
var log     = require('../../config/logger').subLog('user');

log.debug('user service');

// persona states
var ONLINE_STATE = {
  OFFLINE: 0,
  ONLINE: 1,
  BUSY: 2,
  AWAY: 3,
  SNOOZE: 4
}

var steamKey = {
  key: config.steam_api.api_key
};

module.exports = new UserService();

function UserService() {

}

// Get UserSummary by steamid
//
// http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?
//    key=XXXXXXXXXXXXXXXXXXXXXXX&steamids=76561197960435530
//
UserService.prototype.getById = function (ids) {
  if (!ids) {
    throw new Error('id(s) required!');
  }
  var deferred = Promise.defer();
  ids = ld.isArray(ids) ? ids : [ids];

  var query = {
    steamids: ids.join(',')
  };

  request.get({
    url: config.steam_url + 'ISteamUser/GetPlayerSummaries/v0002',
    json: true,
    qs: ld.extend(query, steamKey)
  })
  .then(function (data) {
    data = data.response;
    data.count = data.players.length;
    data.players = ld.map(data.players, function (player) {
      player.lastlogoff = moment.unix(player.lastlogoff).utc().format();
      if (player.timecreated) {
        player.timecreated = moment.unix(player.timecreated).utc().format();
      }
      return player;
    });
    deferred.resolve(data);
  })
  .catch(function (err) {
    deferred.reject(err);
  });

  return deferred.promise;
};

// Get UserSummary by userid
//
UserService.prototype.getByUserId = function (userId) {
  if (!userId) {
    throw new Error('id required!');
  }
  var self = this;
  var deferred = Promise.defer();

  UserService.toSteamId(userId)
    .then(function (steamId) {
      deferred.resolve(self.getById(steamId));
    })
    .catch(function (err) {
      deferred.reject(err);
    });

  return deferred.promise;
};

// Get OwnedGames by steamid
//
// http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?
//   key=XXXXXXXXXXXXXXXXX&steamid=76561197960434622&format=json
//
UserService.prototype.getGamesById = function (id) {
  if (!id) {
    throw new Error('id required!');
  }
  var gameImgUrl = config.steam_media_url.games;
  var deferred = Promise.defer();

  var query = {
    steamid: id,
    include_appinfo: 1
  };

  request.get({
    url: config.steam_url + 'IPlayerService/GetOwnedGames/v0001',
    json: true,
    qs: ld.extend(query, steamKey)
  })
  .then(function (data) {
    var data = data.response;
    data.count = data.game_count;

    data.games = ld.map(data.games, function (game) {
      var currGameImgUrl = gameImgUrl.replace('{appid}', game.appid);
      game.urls = {
        icon: currGameImgUrl.replace('{hash}', game.img_icon_url),
        logo: currGameImgUrl.replace('{hash}', game.img_logo_url)
      };
      return game;
    });

    deferred.resolve(data);
  })
  .catch(function (err) {
    deferred.reject(err);
  });

  return deferred.promise;
};

// Get OwnedGames by userid
//
UserService.prototype.getGames = function (userId) {
  if (!userId) {
    throw new Error('id required!');
  }
  var self = this;
  var deferred = Promise.defer();

  UserService.toSteamId(userId)
    .then(function (steamId) {
      deferred.resolve(self.getGamesById(steamId));
    })
    .catch(function (err) {
      deferred.reject(err);
    });

  return deferred.promise;
};

// Get friend list for user by steamid
//
// http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?
//   key=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX&steamid=76561197960435530&relationship=friend
//
UserService.prototype.getFriendListById = function (id) {
  if (!id) {
    throw new Error('id required!');
  }
  var self = this;
  var deferred = Promise.defer();

  var query = {
    steamid: id,
    relationship: 'friend'
  };

  request.get({
    url: config.steam_url + 'ISteamUser/GetFriendList/v0001',
    json: true,
    qs: ld.extend(query, steamKey)
  })
  .then(function (data) {
    data = data.friendslist;
    var steamIds = ld.map(data.friends, 'steamid');

    self.getById(steamIds)
      .then(function (summaries) {
        data.count = data.friends.length;

        data.friends = ld.map(data.friends, function (friend) {
          friend.friend_since = moment.unix(friend.friend_since).utc().format();
          friend.summary = ld.find(summaries.players, { steamid: friend.steamid });
          friend.personaname = friend.summary.personaname;
          return friend;
        });

        // ordering by online state and last logoff
        var byOnlineState = ld.groupBy(
          ld.sortBy(data.friends, function (friend) {
            return -moment(friend.summary.lastlogoff).unix();
          }), 'summary.personastate'
        );

        // move offline friends to the end
        byOnlineState[100] = byOnlineState[ONLINE_STATE.OFFLINE];
        byOnlineState[ONLINE_STATE.OFFLINE] = [];

        data.friends = ld.flatten(
          ld.values(byOnlineState)
        );

        deferred.resolve(data);
      })
      .catch(function (err) {
        deferred.reject(err);
      });
  })
  .catch(function (err) {
    deferred.reject(err);
  });

  return deferred.promise;
};

// get friend list for userid
//
UserService.prototype.getFriendList = function (userId) {
  if (!userId) {
    throw new Error('id required!');
  }
  var self = this;
  var deferred = Promise.defer();

  UserService.toSteamId(userId)
    .then(function (steamId) {
      deferred.resolve(self.getFriendListById(steamId));
    })
    .catch(function (err) {
      deferred.reject(err);
    });

  return deferred.promise;
};

// convert userid to steamid
//
UserService.toSteamId = function (userId) {
  if (!userId) {
    throw new Error('id required!');
  }
  var deferred = Promise.defer();

  request.get({
    url: config.steam_community_url + userId
  })
  .then(function (data) {
    var re = /"steamid"\s*:\s*"([0-9]+)"/;
    var steamId = re.exec(data)[1];

    deferred.resolve(steamId);
  })
  .catch(function (err) {
    deferred.reject(err);
  });

  return deferred.promise;
};
