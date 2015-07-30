(function () {
'use strict';

app.directive('gameSearchbar', function ($state, GameService){
  
  return {
    scope: {},
    // controller: function($scope, $element, $attrs, $transclude) {},
    // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
    restrict: 'A',
    templateUrl: 'games/game-searchbar.html',
    // replace: true,
    // transclude: true,
    link: function($scope, iElm, iAttrs, controller) {

      $scope.data = {};

      $scope.searchForGameNews = function (gameQuery) {
        
        if (isNaN(gameQuery)) {
          GameService.toAppId(gameQuery).then(function (gameId) {
            $state.go('games', {id: gameId});
          });

        } else {
          $state.go('games', {id: gameQuery});
        }
        // GameService.get(gameId).then(function (data) {
        // });
      };
      
    }
  };
});

})();
