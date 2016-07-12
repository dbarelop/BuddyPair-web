'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('AppCtrl', function($scope, $route, $http, $auth) {
    $scope.$route = $route;
    $http.get('/api/me').then(function (data) {
      $scope.user = data.data;
    });
    $scope.authenticate = function(provider) {
      $auth.authenticate(provider).then(function() {
        console.log('Succesfully signed in with ' + provider);
        $http.get('/api/me').then(function (data) {
          $scope.user = data.data;
        });
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
  controller('ProfileCtrl', function($scope, $route, $http) {
    $scope.$route = $route;
    $http.get('/api/me').then(function (data) {
      $scope.user = data.data;
    });
  }).
  controller('ErasmusCtrl', function($scope, $route, $routeParams, $http) {
    $scope.$route = $route;
    $scope.filters = {};
    $scope.filter_erasmus = function(e) {
      var filters = $scope.filters;
      var nameFilter = !filters.name || (e.name + " " + e.surname).toLowerCase().indexOf(filters.name.toLowerCase()) > -1;
      var assignedPeerFilter = !filters.withPeer || (filters.withPeer == 'all') || 
        (filters.withPeer == 'y' && e.has_peer) || (filters.withPeer == 'n' && !e.has_peer);
      return nameFilter && assignedPeerFilter;
    };
    if ($routeParams.id) {
      $scope.erasmus = null;
      $http.get('/api/erasmus/' + $routeParams.id).then(function (data) {
        $scope.erasmus = data.data[0];
        $http.get('/api/erasmus/' + $routeParams.id + '/assignedPeer').then(function (data) {
          $scope.erasmus.assignedPeer = data.data[0];
        });
      });
    } else {
      $scope.erasmusList = null;
      $http.get('/api/erasmusList').then(function (data) {
        $scope.erasmusList = data.data;
      });
    }
  }).
  controller('PeerCtrl', function($scope, $route, $routeParams, $http) {
    $scope.$route = $route;
    if ($routeParams.id) {
      $scope.peer = null;
      $http.get('/api/peer/' + $routeParams.id).then(function (data) {
        $scope.peer = data.data[0];
        $http.get('/api/peer/' + $routeParams.id + '/assignedErasmus').then(function (data) {
          $scope.peer.assignedErasmus = data.data;
        });
      });
    } else {
      $scope.peerList = null;
      $http.get('/api/peerList').then(function (data) {
        $scope.peerList = data.data;
      });
    }
  });
