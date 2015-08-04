(function () {
'use strict';

app.directive('navbar', function (
  $state
){
  
  return {
    scope: {},
    restrict: 'A',
    templateUrl: 'navbar.html',
    link: function($scope, iElm, iAttrs) {

      $scope.isUsersRoute = function () {
        var stateName = $state.current.name;
        return stateName === 'users' || stateName === 'index';
      };

      $scope.isGamesRoute = function () {
        var stateName = $state.current.name;
        return stateName === 'games' || stateName === 'gamesInitial';
      };

    }
  };
});

})();
