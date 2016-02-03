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
        //templateUrl: 'erasmus',
        // TODO: temporary workaround. templateUrl can't find the template file and causes infinite recursion
        template: '<p>{{erasmus.name}} {{erasmus.surname}}</p>',
        controller: 'ErasmusCtrl'
      }).
      when('/peerList', {
        templateUrl: 'peerList',
        controller: 'PeerCtrl'
      }).
      when('/peer/:id', {
        //templateUrl: 'peer',
        template: '<p>{{peer.name}} {{peer.surname}}</p>',
        controller: 'PeerCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  });
