'use strict';

angular.module('BuddyPairApp.services')
  .service('ErasmusService', function($q, $http) {
    var service = {};

    service.getList = function(semester_id) {
      var deferred = $q.defer();
      $http.get('/api/erasmuses/' + semester_id)
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

    service.getCount = function(semester_id) {
      var deferred = $q.defer();
      $http.get('/api/erasmuses/' + semester_id + '/count')
        .success(function(data) {
          deferred.resolve(data[0]);
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

    service.getById = function(id) {
      var deferred = $q.defer();
      $http.get('/api/erasmus/' + id)
        .success(function(data) {
          var erasmus = data[0];
          $http.get('/api/erasmus/' + id + '/assigned_peer')
            .success(function(data) {
              erasmus.assignedPeer = data[0];
              deferred.resolve(erasmus);
            })
            .error(function(msg, code) {
              deferred.reject({
                code: code,
                message: msg
              });
              console.log(msg);
            });
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

    service.deleteById = function(id) {
      var deferred = $q.defer();
      $http.delete('/api/erasmus/' + id)
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

    service.setAssignedPeer = function(erasmus_id, peer_id) {
      var deferred = $q.defer();
      $http.put('/api/erasmus/' + erasmus_id + '/assigned_peer', { peer_id: peer_id })
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

    service.removeAssignedPeer = function(erasmus_id) {
      var deferred = $q.defer();
      $http.delete('/api/erasmus/' + erasmus_id + '/assigned_peer')
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

    service.addErasmus = function(erasmus) {
      var deferred = $q.defer();
      $http.post('/api/erasmus', { erasmus: erasmus })
        .success(function(data, status, headers, config) {
          deferred.resolve(headers('Location'));
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

    service.editErasmus = function(id, erasmus) {
      var deferred = $q.defer();
      $http.put('/api/erasmus/' + id, { erasmus: erasmus })
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