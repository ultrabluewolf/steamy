(function () {
'use strict';

app.service('LoadingIndicator', function ($rootScope) {
  var self = this;
  
  this.loading = function () {
    $rootScope.isLoading = true;
  };

  this.ready = function () {
    $rootScope.isLoading = false;
  };

});

})();
