(function (ld) {
'use strict';

app.directive('gameDetails', function (){
  
  return {
    scope: {
      game: '=gameDetails'
    },
    restrict: 'A',
    templateUrl: 'games/game-details.html',
    
    link: function($scope, iElm, iAttrs) {

    }
  };
});

})(_);
