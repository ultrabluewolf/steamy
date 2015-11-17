(function (ld) {
'use strict';

app.controller('UserSharedGamesController', function (
  $scope,
  $stateParams,
  $q,
  $log,
  UserService,
  LoadingIndicator
) {

  $scope.data   = $scope.data || {};
  var searchSet = $scope.searchSet = {};
  $scope.isFinished = {};

  if ($stateParams.id) {
    LoadingIndicator.loading();

    var userProm = UserService
      .get($stateParams.id)
      .then(function (data) {
        $scope.isFinished.userProfile = true;
        $scope.data.user = data.players[0];
        $log.debug('user summary', $scope.data.user);
      });

    var friendsProm = UserService
      .getFriends($stateParams.id)
      .then(function (data) {
        $scope.data.friends = data.friends;
        $log.debug('friends', $scope.data.friends[0]);
      });

    $q.all([userProm, friendsProm]).then(function () {
      LoadingIndicator.ready();
    });

  }

  $scope.addUserToSearchSet = function (user) {
    searchSet[user.steamid] = user;
  };

  $scope.removeUserFromSearchSet = function (user) {
    delete searchSet[user.steamid];
  };

  $scope.toggleFilter = function (user) {
    $scope.refreshNeededFlag = true;

    if (searchSet[user.steamid]) {
      $scope.removeUserFromSearchSet(user);
      return false;

    } else {
      $scope.addUserToSearchSet(user);
      return true;
    }

  };

  // 1. collect communityIds for game searches
  // 2. fetch user games
  // 3. fetch selected friends games while performing intersection on collected games  
  $scope.fetchSharedGames = function () {
    LoadingIndicator.loading();
    $log.debug('Finding shared games for:', ld.values(searchSet));
    $scope.refreshNeededFlag = false;
    $scope.data.games = [];

    var communityIds = ld.map(ld.values(searchSet), function (user) {
      return user.communityId;
    });

    UserService
      .getGames($stateParams.id)
      .then(function (data) {
        $scope.data.games = data.games;

        var gamesProms = ld.map(communityIds, function (communityId) {

          return UserService
            .getGames(communityId)
            .then(function (data) {

              $scope.data.games = intersect($scope.data.games, data.games, function (game) {
                return {
                  appid: game.appid
                };
              });

              //$log.debug('games owned', $scope.data.games[0]);
              $q.all(gamesProms).then(function () {
                LoadingIndicator.ready();
                $log.debug('games owned', $scope.data.games.length);
              });

            }); //end return
        }); //end .map(ids)

        if (gamesProms.length === 0) {
          LoadingIndicator.ready();
          $log.debug('games owned', $scope.data.games.length);
        }

      }); //end .then()

  };

  // perform intersection on given lists using given match option generator
  //    i.e. matchBy({id: ..., name: ...}) => {id: ...}
  function intersect(s1, s2, matchBy) {
    var games = ld.map(s1, function (item1) {
      return ld.find(s2, matchBy(item1));
    });

    return ld.filter(games);
  }

});

})(_);
