(function () {
'use strict';

window.app = angular.module('SteamyApp', [
  'ngSanitize',
  'ui.router',
  'steamyTemplates'
]);

app.config(function($locationProvider, $stateProvider, $urlRouterProvider) {
  $locationProvider.html5Mode(true);

  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('index', {
      url: '/',
      controller: 'UserController',
      templateUrl: 'users/index.html'
    })
    .state('users', {
      url: '/users/:id',
      controller: 'UserController',
      templateUrl: 'users/index.html'
    })
    .state('gamesInitial', {
      url: '/games',
      controller: 'GameController',
      templateUrl: 'games/index.html'
    })
    .state('games', {
      url: '/games/:id',
      controller: 'GameController',
      templateUrl: 'games/index.html'
    });

});

})();
