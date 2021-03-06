(function () {
'use strict';

app.service('GameService', function ($http, $q) {
  var _cache = {};

  var BASE_URL = '/api/games/';

  this.get = function (gameId) {
    var cacheKey = gameId;
    var deferred = $q.defer();

    if (!_cache[cacheKey]) {
      $http.get(BASE_URL + gameId)
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
  };  

  this.getNews = function (gameId) {
    var cacheKey = gameId + '.news';
    var deferred = $q.defer();

    if (!_cache[cacheKey]) {
      $http.get(BASE_URL + gameId + '/news')
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
  };

  this.toAppId = function (gameQuery) {
    var deferred = $q.defer();

    $http({
      url: BASE_URL + 'find',
      params: {
        title: gameQuery
      }
    })
      .success(function (data) {
        deferred.resolve(data.body.app_id);

      }).error(function (err) {
        deferred.reject(err);
      });

    return deferred.promise;
  };

});

})();
