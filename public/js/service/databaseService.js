'use strict';

angular.module('BuddyPairApp.services')
  .service('DatabaseService', function($q, $http) {
    var service = {};

    service.getCountries = function() {
      var deferred = $q.defer();
      $http.get('/api/countries')
        .success(function(data) {
          deferred.resolve(data);
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

    service.getStudies = function() {
      var deferred = $q.defer();
      $http.get('/api/studies')
        .success(function(data) {
          deferred.resolve(data);
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

    service.getFaculties = function() {
      var deferred = $q.defer();
      $http.get('/api/faculties')
        .success(function(data) {
          deferred.resolve(data);
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