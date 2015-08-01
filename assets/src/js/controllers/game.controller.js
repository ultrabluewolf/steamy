(function () {
'use strict';

app.controller('GameController', function (
  $scope,
  $stateParams,
  $log,
  GameService,
  LoadingIndicator
){

  $scope.data = $scope.data || {};

  if ($stateParams.id) {
    LoadingIndicator.loading();

    GameService.getNews($stateParams.id)
      .then(function (data) {
        $scope.data.game = data;
        $log.debug($scope.data.game);
        LoadingIndicator.ready();
      });

  }

});

})();
