'use strict';

angular.module('BuddyPairApp.services')
  .service('StudentService', function($q, $http) {
    var service = {};

    service.matchStudents = function(semester_id) {
      var deferred = $q.defer();
      $http.get('/api/match/' + semester_id)
        .success(function() {
          deferred.resolve();
        })
        .error(function(msg, code) {
          deferred.reject({
            code: code,
            message: msg
          });
          console.log(msg);
        });
      return deferred.promise;
    };
    
    return service;
  });
