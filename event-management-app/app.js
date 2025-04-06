// Configuration principale de l'application
(function() {
  'use strict';
  
  var app = angular.module('eventApp', ['ngRoute']);
  
  app.run(['$rootScope', '$location', 'AuthService', function($rootScope, $location, AuthService) {
    $rootScope.$on('$routeChangeStart', function(event, next) {
      if (next.requiresAuth && !AuthService.isLoggedIn()) {
        $location.path('/login');
      }
      if (next.requiresAdmin && !AuthService.isAdmin()) {
        $location.path('/events');
      }
    });
    
    // Make auth methods available in templates
    $rootScope.isLoggedIn = AuthService.isLoggedIn;
    $rootScope.isAdmin = AuthService.isAdmin;
    $rootScope.logout = AuthService.logout;
  }]);

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
  app.controller('EventsController', ['$scope', 'EventService', function($scope, EventService) {
    $scope.events = [];
    $scope.searchParams = {};
    
    // Load all events
    EventService.getAll().then(function(response) {
      $scope.events = response.data;
    });
    
    // Search events
    $scope.searchEvents = function() {
      EventService.search($scope.searchParams).then(function(response) {
        $scope.events = response.data;
      });
    };
  }]);
  
  app.controller('EventDetailsController', ['$scope', '$routeParams', 'EventService', function($scope, $routeParams, EventService) {
    EventService.get($routeParams.id).then(function(response) {
      $scope.event = response.data;
    });
    
    $scope.deleteEvent = function(id) {
      if(confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
        EventService.delete(id).then(function() {
          window.location.href = '#/events';
        });
      }
    };
  }]);
  
  app.controller('EventFormController', ['$scope', '$location', '$routeParams', 'EventService', function($scope, $location, $routeParams, EventService) {
    if($routeParams.id) {
      // Edit mode
      EventService.get($routeParams.id).then(function(response) {
        $scope.event = response.data;
      });
    } else {
      // Create mode
      $scope.event = {};
    }
    
    $scope.saveEvent = function() {
      if($routeParams.id) {
        EventService.update($routeParams.id, $scope.event).then(function() {
          $location.path('/events/' + $routeParams.id);
        });
      } else {
        EventService.create($scope.event).then(function(response) {
          $location.path('/events/' + response.data.id);
        });
      }
    };
    
    $scope.cancel = function() {
      $location.path('/events');
    };
  }]);

  app.controller('LoginController', ['$scope', 'AuthService', '$location', function($scope, AuthService, $location) {
    $scope.credentials = {};
    
    $scope.login = function() {
      AuthService.login($scope.credentials)
        .then(function() {
          $location.path('/events');
        })
        .catch(function(error) {
          alert('Erreur de connexion: ' + error.data.message);
        });
    };
  }]);
  
  app.controller('AdminController', ['$scope', 'AuthService', function($scope, AuthService) {
    $scope.stats = {
      totalUsers: 0,
      totalEvents: 0,
      activeEvents: 0
    };
    
    // TODO: Implement actual stats loading
    $scope.loadStats = function() {
      // Will be implemented when backend API is ready
    };
    
    // Load stats on controller init
    $scope.loadStats();
  }]);

  app.controller('AdminEventsController', ['$scope', 'EventService', function($scope, EventService) {
    $scope.events = [];
    
    // Load all events with creator info
    $scope.loadEvents = function() {
      EventService.getAll({ populate: 'creator' }).then(function(response) {
        $scope.events = response.data;
      });
    };
    
    // Delete event
    $scope.deleteEvent = function(eventId) {
      if(confirm('Supprimer définitivement cet événement ?')) {
        EventService.delete(eventId).then(function() {
          $scope.loadEvents();
        });
      }
    };
    
    // Load events on init
    $scope.loadEvents();
  }]);

  app.controller('AdminUsersController', ['$scope', '$http', function($scope, $http) {
    $scope.users = [];
    
    // Load all users
    $scope.loadUsers = function() {
      $http.get('/api/users').then(function(response) {
        $scope.users = response.data;
      });
    };
    
    // Update user role
    $scope.updateRole = function(user) {
      $http.put('/api/users/' + user._id + '/role', { role: user.role });
    };
    
    // Delete user
    $scope.deleteUser = function(userId) {
      if(confirm('Supprimer cet utilisateur ?')) {
        $http.delete('/api/users/' + userId).then(function() {
          $scope.loadUsers();
        });
      }
    };
    
    // Load users on init
    $scope.loadUsers();
  }]);

  app.controller('RegisterController', ['$scope', 'AuthService', '$location', function($scope, AuthService, $location) {
    $scope.user = { role: 'user' };
    $scope.isAdminRegistration = false; // Set to true for admin registration flows
    
    $scope.register = function() {
      if ($scope.user.password !== $scope.user.confirmPassword) {
        alert('Les mots de passe ne correspondent pas');
        return;
      }

      AuthService.register($scope.user)
        .then(function() {
          alert('Inscription réussie!');
          $location.path('/login');
        })
        .catch(function(error) {
          alert("Erreur d'inscription: " + error.data.message);
        });
    };
  }]);
  
  // Filtres
  app.filter('calendar', function() {
    return function(input) {
      return moment(input).calendar();
    };
  });
})();