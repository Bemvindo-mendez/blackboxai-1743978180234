// Configuration principale de l'application
(function() {
  'use strict';
  
  var app = angular.module('eventApp', ['ngRoute']);
  
  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginController'
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterController'
      })
      .when('/events', {
        templateUrl: 'views/events.html',
        controller: 'EventsController'
      })
      .when('/events/new', {
        templateUrl: 'views/event-form.html',
        controller: 'EventFormController'
      })
      .when('/events/:id', {
        templateUrl: 'views/event-details.html',
        controller: 'EventDetailsController'
      })
      .when('/events/:id/edit', {
        templateUrl: 'views/event-form.html',
        controller: 'EventFormController'
      })
      .otherwise({
        redirectTo: '/login'
      });
  }]);
  
  // Contrôleurs
  app.controller('LoginController', ['$scope', function($scope) {
    $scope.user = {};
    $scope.login = function() {
      console.log('Login attempt with', $scope.user);
      // Implémenter la logique de connexion
    };
  }]);
  
  app.controller('RegisterController', ['$scope', function($scope) {
    $scope.user = {};
    $scope.register = function() {
      console.log('Registration attempt with', $scope.user);
      // Implémenter la logique d'inscription
    };
  }]);
  
  // Filtres
  app.filter('calendar', function() {
    return function(input) {
      return moment(input).calendar();
    };
  });
})();