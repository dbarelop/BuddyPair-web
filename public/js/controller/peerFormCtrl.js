'use strict';

angular.module('BuddyPairApp.controllers')
  .controller('NewPeerCtrl', ['$scope', '$location', 'PeerService', 'DatabaseService', function($scope, $location, PeerService, DatabaseService) {
    // TODO: get from database *efficiently*
    $scope.countries = [];
    $scope.studies = [];
    $scope.faculties = [];
    DatabaseService.getCountries().then(function(list) { $scope.countries = list; });
    DatabaseService.getStudies().then(function(list) { $scope.studies = list; });
    DatabaseService.getFaculties().then(function(list) { $scope.faculties = list; });

    $scope.peer = {};
    $scope.peer.erasmus_limit = 1;

    $scope.submit = function() {
      PeerService.addPeer($scope.peer).then(function(location) {
        $location.path(location);
      });
    };

    $(function() {
      $('#birthdate').datetimepicker({
        format: 'YYYY-MM-DD'
      });
      $('#birthdate').on('dp.change', function() {
        $scope.peer.birthdate = $('#birthdate > input').val();
      });
      $('#register_date').datetimepicker({
        format: 'YYYY-MM-DD HH:mm:ss',
        sideBySide: true
      });
      $('#register_date').on('dp.change', function() {
        $scope.peer.birthdate = $('#register_date > input').val();
      });
    });
  }])
  .controller('EditPeerCtrl', ['$scope', '$location', '$routeParams', 'PeerService', 'DatabaseService', function($scope, $location, $routeParams, PeerService, DatabaseService) {
    // TODO: get from database *efficiently*
    $scope.countries = [];
    $scope.studies = [];
    $scope.faculties = [];
    DatabaseService.getCountries().then(function(list) { $scope.countries = list; });
    DatabaseService.getStudies().then(function(list) { $scope.studies = list; });
    DatabaseService.getFaculties().then(function(list) { $scope.faculties = list; });

    PeerService.getById($routeParams.id).then(function(peer) { $scope.peer = peer; });

    $scope.submit = function() {
      PeerService.editPeer($scope.peer.peer_id, $scope.peer).then(function(location) {
        $location.path('/peer/' + $scope.peer.peer_id);
      });
    };

    $(function() {
      $('#birthdate').datetimepicker({
        format: 'YYYY-MM-DD'
      });
      $('#birthdate').on('dp.change', function() {
        $scope.peer.birthdate = $('#birthdate > input').val();
      });
      $('#register_date').datetimepicker({
        format: 'YYYY-MM-DD HH:mm:ss',
        sideBySide: true
      });
      $('#register_date').on('dp.change', function() {
        $scope.peer.register_date = $('#register_date > input').val();
      });
    });
  }]);
