'use strict';

angular.module('BuddyPairApp.controllers')
  .controller('ErasmusCtrl', ['$scope', '$route', '$routeParams', 'ErasmusService', 'PeerService', function($scope, $route, $routeParams, ErasmusService, PeerService) {
    // Get the Erasmus' information from the API
    $scope.erasmus = {};
    $scope.erasmus.assignedPeer = null;
    ErasmusService.getById($routeParams.id).then(function(erasmus) {
      $scope.erasmus = erasmus;
      $scope.selectedPeer = erasmus.assignedPeer;
    }, function (err) {
      $scope.error = err.message.code;
    });
    // Setup the peer assignment action
    $scope.setSelectedPeer = function(peer) {
      $scope.selectedPeer = peer;
    };
    $scope.restoreSelectedPeer = function() {
      $scope.selectedPeer = $scope.erasmus.assignedPeer;
    };
    $scope.availablePeers = null;
    PeerService.getList($scope.selected_semester_id.item).then(function(peers) { $scope.availablePeers = peers; });
    $scope.updateAssignedPeer = function() {
      if (!$scope.selectedPeer && $scope.erasmus.assignedPeer) {
        // If there's no selected peer and the Erasmus previously had one, delete it
        $scope.erasmus.assignedPeer.num_erasmus--;
        ErasmusService.removeAssignedPeer($scope.erasmus.erasmus_id);
      } else if ($scope.selectedPeer && !$scope.erasmus.assignedPeer) {
        // If there is a new selected peer and the Erasmus didn't have one, add it
        $scope.selectedPeer.num_erasmus++;
        ErasmusService.setAssignedPeer($scope.erasmus.erasmus_id, $scope.selectedPeer.peer_id);
      } else if ($scope.selectedPeer && $scope.erasmus.assignedPeer && $scope.erasmus.assignedPeer.peer_id !== $scope.selectedPeer.peer_id) {
        // If there is a new selected peer, the Erasmus had already an assigned peer and it's not the same as the selected one, replace it
        $scope.selectedPeer.num_erasmus++;
        $scope.erasmus.assignedPeer.num_erasmus--;
        ErasmusService.setAssignedPeer($scope.erasmus.erasmus_id, $scope.selectedPeer.peer_id);
      }
      $scope.erasmus.assignedPeer = $scope.selectedPeer;
    };
    // Setup the Erasmus deletion action
    $scope.deleteErasmus = function() {
      if (confirm('Do you want to delete ' + $scope.erasmus.name + ' ' + $scope.erasmus.surname + '\'s profile?\n' +
          '(The assigned peer, if any, won\'t be deleted)')) {
        ErasmusService.deleteById($scope.erasmus.erasmus_id).then(function () {
          $scope.erasmus = null;
        });
      }
    };
  }]);