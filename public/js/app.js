'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', ['myApp.controllers', 'ngRoute', 'satellizer']).
  config(function ($routeProvider, $locationProvider, $authProvider) {
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
  
    $authProvider.google({
      clientId: '83414652329-fajrap1l590te27mjc8jec8q393okmfv.apps.googleusercontent.com'
    });
  });
