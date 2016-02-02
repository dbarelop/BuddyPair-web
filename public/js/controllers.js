'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('AppCtrl', function ($scope, $http) {
    $http.get('/api/name').then(function(data) {
      $scope.name = data.data.name;
    });
  }).
  controller('ErasmusCtrl', function($scope, $routeParams, $http) {
    if ($routeParams.id)
      $http.get('/api/erasmus/' + $routeParams.id).then(function(data) {
        $scope.erasmus = data.data;
      });
    else
      $http.get('/api/erasmusList').then(function(data) {
        $scope.erasmusList = data.data;
      });
  }).
  controller('PeerCtrl', function($scope, $routeParams, $http) {
    if ($routeParams.id)
      $http.get('/api/peer/' + $routeParams.id).then(function(data) {
        $scope.peer = data.data;
      });
    else
      $http.get('/api/peerList').then(function(data) {
        $scope.peerList = data.data;
      });
  });
