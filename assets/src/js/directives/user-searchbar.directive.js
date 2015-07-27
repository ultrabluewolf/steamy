(function () {
'use strict';

app.directive('userSearchbar', function ($state, UserService){
  
  return {
    scope: {},
    // controller: function($scope, $element, $attrs, $transclude) {},
    // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
    restrict: 'A',
    templateUrl: 'users/user-searchbar.html',
    // replace: true,
    // transclude: true,
    link: function($scope, iElm, iAttrs, controller) {

      $scope.data = {};

      $scope.searchForUser = function (username) {
        $state.go('users', {id: username});
        // UserService.get(username).then(function (data) {

        // });
      };
      
    }
  };
});

})();
