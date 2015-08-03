(function () {
'use strict';

app.controller('GameController', function (
  $scope,
  $stateParams,
  $q,
  $log,
  GameService,
  LoadingIndicator
){

  $scope.data = $scope.data || {};

  if ($stateParams.id) {
    LoadingIndicator.loading();

    var newsProm = GameService
      .getNews($stateParams.id)
      .then(function (data) {
        $scope.data.newsitems = data.newsitems;
        $log.debug($scope.data.newsitems);
      });

    var gameProm = GameService
      .get($stateParams.id)
      .then(function (data) {
        $scope.data.game = data;
        $log.debug($scope.data.game);
      });

    $q.all([newsProm, gameProm]).then(function () {
      LoadingIndicator.ready();
    });

  }

});

})();
