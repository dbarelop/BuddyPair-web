'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', ['myApp.controllers', 'ngRoute']).
  config(function ($routeProvider, $locationProvider) {
    $routeProvider.
      when('/erasmusList', {
        templateUrl: '/partials/erasmusList',
        controller: 'ErasmusCtrl'
      }).
      when('/erasmus/:id', {
        templateUrl: '/partials/erasmusProfile',
        controller: 'ErasmusCtrl'
      }).
      when('/peerList', {
        templateUrl: '/partials/peerList',
        controller: 'PeerCtrl'
      }).
      when('/peer/:id', {
        templateUrl: '/partials/peerProfile',
        controller: 'PeerCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  });
