(function () {
'use strict';

/*
 * on-enter: execute given function
 */

app.directive('onEnter', function (){
  
  return {
    scope: {
      action: '&onEnter'
    },
    restrict: 'A',
    link: function($scope, iElm, iAttrs) {

      iElm.bind('keyup', function ($evt) {
        if ($evt.which === 13){
          $scope.action();
        }
      });

    }
  };
});

})();
