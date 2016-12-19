'use strict';

angular.module('BuddyPairApp.controllers')
  .controller('NewErasmusCtrl', ['$scope', '$location', 'ErasmusService', 'DatabaseService', function($scope, $location, ErasmusService, DatabaseService) {
    // TODO: get from database *efficiently*
    $scope.countries = [];
    $scope.studies = [];
    $scope.faculties = [];
    DatabaseService.getCountries().then(function(list) { $scope.countries = list; });
    DatabaseService.getStudies().then(function(list) { $scope.studies = list; });
    DatabaseService.getFaculties().then(function(list) { $scope.faculties = list; });

    $scope.erasmus = {};

    $scope.submit = function() {
        ErasmusService.addErasmus($scope.erasmus).then(function() {
          $location.path('/erasmusList');
        });
    }
  }])
  .controller('EditErasmusCtrl', ['$scope', '$location', '$routeParams', 'ErasmusService', 'DatabaseService', function($scope, $location, $routeParams, ErasmusService, DatabaseService) {
    // TODO: get from database *efficiently*
    $scope.countries = [];
    $scope.studies = [];
    $scope.faculties = [];
    DatabaseService.getCountries().then(function(list) { $scope.countries = list; });
    DatabaseService.getStudies().then(function(list) { $scope.studies = list; });
    DatabaseService.getFaculties().then(function(list) { $scope.faculties = list; });

    //$scope.erasmus = {};
    ErasmusService.getById($routeParams.id).then(function(erasmus) { $scope.erasmus = erasmus; });

    $scope.submit = function() {
      ErasmusService.editErasmus($scope.erasmus.erasmus_id, $scope.erasmus).then(function() {
        $location.path('/erasmusList');
      });
    }
  }]);