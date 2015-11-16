(function (ld) {
'use strict';

app.directive('userProfile', function ($state){
  
  return {
    scope: {
      user:      '=userProfile',
      onClickFn: '&userProfileOnClick'
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

      $scope.onIconClick = function () {
        var isToggled = $scope.onClickFn();
        
        if (isToggled === undefined) {
          return;
        }

        if (isToggled) {
          iElm.addClass('selected');
        } else {
          iElm.removeClass('selected')
        }

      };

      $scope.toCommunityId = function (user) {
        var str = user.profileurl;
        if (str) {
          var matched = str.match(/\/id\/(\S+)/);
          if (matched && matched[1]) {
            var communityId = matched[1].slice(0, -1);
            user.communityId = communityId;
            return communityId;
          }
        }

        return;
      };

    }
  };
});

})(_);
