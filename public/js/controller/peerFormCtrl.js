'use strict';

angular.module('BuddyPairApp.controllers')
  .controller('NewPeerCtrl', ['$scope', '$location', 'PeerService', 'DatabaseService', function($scope, $location, PeerService, DatabaseService) {
    $scope.peer = {};
    $scope.peer.erasmus_limit = 1;

    $scope.submit = function() {
      $scope.peer.semester_id = $scope.selected_semester.value.id;
      PeerService.addPeer($scope.peer).then(function(location) {
        $location.path(location);
      }, function(error) {
        $scope.error = error.message;
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
  }])
  .controller('EditPeerCtrl', ['$scope', '$location', '$routeParams', 'PeerService', 'DatabaseService', function($scope, $location, $routeParams, PeerService, DatabaseService) {
    PeerService.getById($routeParams.id).then(function(peer) { $scope.peer = peer; });

    $scope.submit = function() {
      PeerService.editPeer($scope.peer.peer_id, $scope.peer).then(function(location) {
        $location.path('/peer/' + $scope.peer.peer_id);
      }, function(error) {
        $scope.error = error.message;
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
