'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('AppCtrl', function($scope, $http, $auth) {
    $http.get('/api/me').then(function(data) {
      $scope.user = data.data;
    });
    $scope.authenticate = function(provider) {
      $auth.authenticate(provider).then(function() {
        console.log('Succesfully signed in with ' + provider);
      }).
      catch(function(err) {
        if (err.error) {
          console.log(err.error);
        } else if (err.data) {
          console.log(err.data.message, err.status);
        } else {
          console.log(err);
        }
      });
    };
    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };
    $scope.logout = function() {
      $auth.logout().then(function() {
        console.log('Logged out');
      });
    };
  }).
  controller('ProfileCtrl', function($scope, $http) {
    $http.get('/api/me').then(function(data) {
      $scope.user = data.data;
    });
  }).
  controller('ErasmusCtrl', function($scope, $routeParams, $http) {
    if ($routeParams.id)
      $http.get('/api/erasmus/' + $routeParams.id).then(function(data) {
        $scope.erasmus = data.data[0];
        $http.get('/api/erasmus/' + $routeParams.id + '/assignedPeer').then(function(data) {
          $scope.assignedPeer = data.data[0];
        });
      });
    else
      $http.get('/api/erasmusList').then(function(data) {
        $scope.erasmusList = data.data;
      });
  }).
  controller('PeerCtrl', function($scope, $routeParams, $http) {
    if ($routeParams.id)
      $http.get('/api/peer/' + $routeParams.id).then(function(data) {
        $scope.peer = data.data[0];
        $http.get('/api/peer/' + $routeParams.id + '/assignedErasmus').then(function(data) {
          $scope.assignedErasmus = data.data;
        });
      });
    else
      $http.get('/api/peerList').then(function(data) {
        $scope.peerList = data.data;
      });
  });
