'use strict';

// Declare app level module which depends on filters, and services

angular.module('BuddyPairApp', ['BuddyPairApp.controllers', 'BuddyPairApp.services', 'ngRoute', 'satellizer', 'chart.js']).
config(function ($routeProvider, $locationProvider, $authProvider) {
  $routeProvider
    .when('/profile', {
      templateUrl: '/partials/profile',
      controller: 'ProfileCtrl',
      activetab: 'profile'
    })
    .when('/erasmusList', {
      templateUrl: '/partials/erasmusList',
      controller: 'ErasmusCtrl',
      activetab: 'erasmusList'
    })
    .when('/erasmus/:id', {
      templateUrl: '/partials/erasmusProfile',
      controller: 'ErasmusCtrl',
      activetab: 'erasmusList'
    })
    .when('/peerList', {
      templateUrl: '/partials/peerList',
      controller: 'PeerCtrl',
      activetab: 'peerList'
    })
    .when('/peer/:id', {
      templateUrl: '/partials/peerProfile',
      controller: 'PeerCtrl',
      activetab: 'peerList'
    })
    .when('/erasmus/new', {
      templateUrl: '/partials/erasmusForm',
      controller: 'NewErasmusCtrl',
      activetab: 'newErasmus'
    })
    .when('/erasmus/:id/edit', {
      templateUrl: '/partials/erasmusForm',
      controller: 'EditErasmusCtrl',
      activetab: 'editErasmus'
    })
    .otherwise({
      templateUrl: '/partials/stats',
      controller: 'StatsCtrl',
      redirectTo: '/',
      activetab: 'index'
    });

  $locationProvider.html5Mode(true);

  $authProvider.google({
    clientId: '83414652329-fajrap1l590te27mjc8jec8q393okmfv.apps.googleusercontent.com'
  });
});

angular.module('BuddyPairApp.controllers', []);
angular.module('BuddyPairApp.services', []);
