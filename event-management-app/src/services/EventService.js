angular.module('eventApp')
.factory('EventService', ['$http', function($http) {
  const baseUrl = '/api/events';
  
  return {
    // Get all events
    getAll: function() {
      return $http.get(baseUrl);
    },
    
    // Get single event
    get: function(id) {
      return $http.get(`${baseUrl}/${id}`);
    },
    
    // Create new event
    create: function(event) {
      return $http.post(baseUrl, event);
    },
    
    // Update event
    update: function(id, event) {
      return $http.put(`${baseUrl}/${id}`, event);
    },
    
    // Delete event
    delete: function(id) {
      return $http.delete(`${baseUrl}/${id}`);
    },
    
    // Search events
    search: function(params) {
      return $http.get(baseUrl, { params: params });
    },
    
    // Register for event
    register: function(eventId, userId) {
      return $http.post(`${baseUrl}/${eventId}/register`, { userId });
    }
  };
}]);