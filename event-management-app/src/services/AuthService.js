angular.module('eventApp')
.factory('AuthService', ['$http', '$window', function($http, $window) {
  const API_URL = '/api/auth';
  const USER_KEY = 'currentUser';

  return {
    // Register new user
    register: function(user) {
      return $http.post(`${API_URL}/register`, user);
    },

    // Login user
    login: function(credentials) {
      return $http.post(`${API_URL}/login`, credentials)
        .then(function(response) {
          // Store user details and token
          $window.sessionStorage[USER_KEY] = JSON.stringify(response.data);
          return response;
        });
    },

    // Logout user
    logout: function() {
      delete $window.sessionStorage[USER_KEY];
    },

    // Get current user
    getCurrentUser: function() {
      const user = $window.sessionStorage[USER_KEY];
      return user ? JSON.parse(user) : null;
    },

    // Check if user is logged in
    isLoggedIn: function() {
      return !!this.getCurrentUser();
    },

    // Check if user has admin role
    isAdmin: function() {
      const user = this.getCurrentUser();
      return user && user.role === 'admin';
    }
  };
}]);