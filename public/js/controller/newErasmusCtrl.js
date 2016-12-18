'use strict';

angular.module('BuddyPairApp.controllers')
  .controller('NewErasmusCtrl', ['$scope', 'ErasmusService', function($scope, ErasmusService) {
    // TODO: get from database *efficiently*
    $scope.countries = [
      {name: 'Spain', code: 'ES'},
      {name: 'United Kingdom', code: 'UK'},
      {name: 'France', code: 'FR'}
    ];
    $scope.studies = [
      {name: 'Studies 1'},
      {name: 'Studies 2'},
      {name: 'Studies 3'}
    ];
    $scope.faculties = [
      {name: 'Faculty 1'},
      {name: 'Faculty 2'},
      {name: 'Faculty 3'}
    ];

  }]);