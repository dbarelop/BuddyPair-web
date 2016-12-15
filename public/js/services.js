
/* Services */

angular.module('BuddyPairApp.services')
    .service('ErasmusService', function($q, $http) {
        var service = {};

        service.getList = function() {
            var deferred = $q.defer();
            $http.get('/api/erasmus')
                .success(function(data) {
                    deferred.resolve(data);
                }).error(function(msg, code) {
                    deferred.reject({
                        code: code,
                        message: msg
                    });
                    console.log(msg);
                });
            return deferred.promise;
        };

        service.getCount = function() {
            var deferred = $q.defer();
            $http.get('/api/erasmus/count')
                .success(function(data) {
                    deferred.resolve(data);
                }).error(function(msg, code) {
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
                    $http.get('/api/erasmus/' + id + '/assignedPeer')
                        .success(function(data) {
                            erasmus.assignedPeer = data[0];
                            deferred.resolve(erasmus);
                        }).error(function(msg, code) {
                            deferred.reject({
                                code: code,
                                message: msg
                            });
                            console.log(msg);
                        });
                }).error(function(msg, code) {
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
                }).error(function(msg, code) {
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