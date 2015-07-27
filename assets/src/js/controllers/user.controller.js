(function () {
'use strict';

app.controller('UserController', function ($scope, $stateParams, $log, UserService){

  $scope.data = $scope.data || {};
  $scope.isFinished = {};

  if ($stateParams.id) {

    UserService.get($stateParams.id)
      .then(function (data) {
        $scope.isFinished.userProfile = true;
        $scope.data.user = data.players[0];
        $log.debug('user summary', $scope.data.user);
      });

    UserService.getFriends($stateParams.id)
      .then(function (data) {
        $scope.data.friends = data.friends;
        $log.debug('friends', $scope.data.friends[0]);
      });

    UserService.getGames($stateParams.id)
      .then(function (data) {
        $scope.data.games = data.games;
        $log.debug('games owned', $scope.data.games[0]);
      });

  }

});

})();
