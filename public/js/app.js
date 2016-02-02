'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', ['myApp.controllers', 'ngRoute']).
  config(function ($routeProvider, $locationProvider) {
    $routeProvider.
      when('/erasmusList', {
        templateUrl: 'erasmusList',
        controller: 'ErasmusCtrl'
      }).
      when('/erasmus/:id', {
        templateUrl: 'erasmus',
        controller: 'ErasmusCtrl'
      }).
      when('/peerList', {
        templateUrl: 'peerList',
        controller: 'PeerCtrl'
      }).
      when('/peer/:id', {
        templateUrl: 'peer',
        controller: 'PeerCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  });
