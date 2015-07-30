(function () {
'use strict';

app.service('GameService', function ($http, $q) {
  var _cache = {};

  var BASE_URL = '/api/games/';

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
    //var cacheKey = gameQuery + '.app_id';
    var deferred = $q.defer();

    //if (!_cache[cacheKey]) {
      $http({
        url: BASE_URL + 'find',
        params: {
          title: gameQuery
        }
      })
        .success(function (data) {
          //_cache[cacheKey] = data.body;
          deferred.resolve(data.body.app_id);

        }).error(function (err) {
          deferred.reject(err);
        });

    // } else {
    //   deferred.resolve(_cache[cacheKey]);
    // }

    return deferred.promise;
  };

});

})();
