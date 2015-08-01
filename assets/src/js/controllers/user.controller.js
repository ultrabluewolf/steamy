(function () {
'use strict';

app.controller('UserController', function (
  $scope,
  $stateParams,
  $q,
  $log,
  UserService,
  LoadingIndicator
){

  $scope.data = $scope.data || {};
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

    var gamesProm = UserService
      .getGames($stateParams.id)
      .then(function (data) {
        $scope.data.games = data.games;
        $log.debug('games owned', $scope.data.games[0]);
      });

    $q.all([userProm, friendsProm, gamesProm]).then(function () {
      LoadingIndicator.ready();
    });

  }

});

})();
