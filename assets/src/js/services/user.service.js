(function () {
'use strict';

app.service('UserService', function ($http, $q){
  var _cache = {};

  var BASE_URL = '/api/users/';
  var FRIENDS  = 'friends';
  var GAMES    = 'games';

  this.get = function (username) {
    return fetchRequest(null, username);
  };

  this.getFriends = function (username) {
    return fetchRequest(FRIENDS, username);
  };

  this.getGames = function (username) {
    return fetchRequest(GAMES, username);
  };

  // request helper
  function fetchRequest(type, username) {
    var cacheKey = username;
    var url = BASE_URL + username;
    if (type === FRIENDS) {
      url += '/friends';
      cacheKey += '.friends';
    } else if (type === GAMES) {
      url += '/games';
      cacheKey += '.games';
    }

    var deferred = $q.defer();

    if (!_cache[cacheKey]) {

      $http.get(url)
        .success(function (data) {
          _cache[cacheKey] = data.body;
          deferred.resolve(data.body);

        }).error(function (err) {
          deferred.reject(err);
        });

    } else {
      deferred.resolve(_cache[cacheKey]);
    }

    return deferred.promise;
  }

});

})();
