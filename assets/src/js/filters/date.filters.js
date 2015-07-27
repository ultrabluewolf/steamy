(function () {
'use strict';

app.filter('relativeTime', function (){
  
  return function (dateStr) {
    return moment(dateStr).fromNow();
  };

});

})();
