'use strict';

angular.module('BuddyPairApp.controllers')
  .controller('NewErasmusCtrl', ['$scope', '$location', 'ErasmusService', 'DatabaseService', function($scope, $location, ErasmusService, DatabaseService) {
    $scope.erasmus = {};

    $scope.submit = function() {
      ErasmusService.addErasmus($scope.erasmus).then(function(location) {
        $location.path(location);
      });
    };

    $(function() {
      $('#birthdate').datetimepicker({
        format: 'YYYY-MM-DD'
      });
      $('#birthdate').on('dp.change', function() {
        $scope.erasmus.birthdate = $('#birthdate > input').val();
      });
      $('#register_date').datetimepicker({
        format: 'YYYY-MM-DD HH:mm:ss',
        sideBySide: true
      });
      $('#register_date').on('dp.change', function() {
        $scope.erasmus.birthdate = $('#register_date > input').val();
      });
      $('#arrival_date').datetimepicker({
        format: 'YYYY-MM-DD HH:mm:ss',
        sideBySide: true
      });
      $('#arrival_date').on('dp.change', function() {
        $scope.erasmus.birthdate = $('#arrival_date > input').val();
      });
    });
  }])
  .controller('EditErasmusCtrl', ['$scope', '$location', '$routeParams', 'ErasmusService', 'DatabaseService', function($scope, $location, $routeParams, ErasmusService, DatabaseService) {
    //$scope.erasmus = {};
    ErasmusService.getById($routeParams.id).then(function(erasmus) { $scope.erasmus = erasmus; console.log(erasmus); });

    $scope.submit = function() {
      ErasmusService.editErasmus($scope.erasmus.erasmus_id, $scope.erasmus).then(function() {
        $location.path('/erasmus/' + $scope.erasmus.erasmus_id);
      });
    };

    $(function() {
      $('#birthdate').datetimepicker({
        format: 'YYYY-MM-DD'
      });
      $('#birthdate').on('dp.change', function() {
        $scope.erasmus.birthdate = $('#birthdate > input').val();
      });
      $('#register_date').datetimepicker({
        format: 'YYYY-MM-DD HH:mm:ss',
        sideBySide: true
      });
      $('#register_date').on('dp.change', function() {
        $scope.erasmus.birthdate = $('#register_date > input').val();
      });
      $('#arrival_date').datetimepicker({
        format: 'YYYY-MM-DD HH:mm:ss',
        sideBySide: true
      });
      $('#arrival_date').on('dp.change', function() {
        $scope.erasmus.birthdate = $('#arrival_date > input').val();
      });
    });
  }]);