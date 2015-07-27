(function () {
'use strict';

app.controller('GameController', function ($scope, $stateParams, $log, GameService){

  $scope.data = $scope.data || {};

  if ($stateParams.id) {

    GameService.getNews($stateParams.id)
      .then(function (data) {
        $scope.data.game = data;
        $log.debug($scope.data.game);
      });

  }

});

})();
