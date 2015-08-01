(function () {
'use strict';

app.filter('relativeTime', function (){
  
  return function (dateStr) {
    return moment(dateStr).fromNow();
  };

});

app.filter('minToHrs', function (){
  
  return function (minutes) {
    var hrs = Math.floor(minutes / 60);
    var mins = (minutes % 60);

    var str = '';
    if (hrs) {
      str += hrs + 'h ';
    }
    if (mins) {
      str += mins + 'm';
    }
    return str;
  };

});

})();
