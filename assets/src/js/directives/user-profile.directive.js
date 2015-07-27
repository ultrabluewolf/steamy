(function (ld) {
'use strict';

app.directive('userProfile', function ($state){
  
  return {
    scope: {
      user: '=userProfile'
    },
    // controller: function($scope, $element, $attrs, $transclude) {},
    // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
    restrict: 'A',
    templateUrl: 'users/user-profile.html',
    // replace: true,
    // transclude: true,
    link: function($scope, iElm, iAttrs, controller) {

      var user = ld.extend({}, $scope.user);

      if (user.summary) {
        var profile = user.summary;
        delete user.summary;

        profile.relationship_info = user;
        $scope.user = profile;

      }

    }
  };
});

})(_);
