'use strict';

angular.module('BuddyPairApp.controllers')
  .controller('PeerCtrl', ['$scope', '$route', '$routeParams', 'PeerService', 'ErasmusService', function($scope, $route, $routeParams, PeerService, ErasmusService) {
    // Get the peer's information from the API
    $scope.peer = {};
    $scope.peer.assignedErasmus = [];
    $scope.selectedErasmus = [];
    PeerService.getById($routeParams.id).then(function(peer) {
      $scope.peer = peer;
      $scope.selectedErasmus = peer.assignedErasmus.slice();
      ErasmusService.getList().then(function(erasmusList) {
        $scope.availableErasmus = erasmusList.filter(function(e1) {
          var isAssigned = false;
          peer.assignedErasmus.forEach(function(e2) { isAssigned |= e1.erasmus_id == e2.erasmus_id; });
          return !e1.has_peer || isAssigned;
        });
      });
    }, function(err) {
      $scope.error = err.message.code;
    });
    // Setup the Erasmus assignment action
    $scope.selectionContains = function(erasmus) {
      var contained = false;
      $scope.selectedErasmus.forEach(function(e) {
        contained |= erasmus.erasmus_id == e.erasmus_id;
      });
      return contained;
    };
    $scope.addSelectedErasmus = function(erasmus) {
      if (!$scope.selectionContains(erasmus)) {
        erasmus.has_peer = true;
        $scope.selectedErasmus.push(erasmus);
      } else {
        // Toggle selection
        erasmus.has_peer = false;
        for (var i = 0; i < $scope.selectedErasmus.length; i++)
          if ($scope.selectedErasmus[i].erasmus_id == erasmus.erasmus_id)
            $scope.selectedErasmus.splice(i, 1);
      }
    };
    $scope.restoreSelectedErasmus = function() {
      $scope.selectedErasmus = $scope.peer.assignedErasmus.slice();
    };
    $scope.availableErasmus = null;
    $scope.updateAssignedErasmus = function() {
      if ($scope.selectedErasmus.length == 0 && $scope.peer.assignedErasmus != 0) {
        // If there aren't any Erasmus selected and the peer previously had any, delete them
        PeerService.removeAllAssignedErasmus($scope.peer.peer_id);
      } else if ($scope.selectedErasmus.length != 0 && $scope.peer.assignedErasmus == 0) {
        // If there is at least one Erasmus selected and the peer didn't have any assigned, add them
        $scope.selectedErasmus.forEach(function(e) {
          PeerService.addAssignedErasmus($scope.peer.peer_id, e.erasmus_id);
        });
      } else if ($scope.selectedErasmus.length > 0 && $scope.peer.assignedErasmus.length > 0) {
        // If there is at least one Erasmus selected and the peer already has one or more assigned...
        $scope.peer.assignedErasmus.forEach(function(e1) {
          // ... delete the ones that are not selected
          var remove = true;
          $scope.selectedErasmus.forEach(function(e2) {
            remove &= e1.erasmus_id != e2.erasmus_id;
          });
          if (remove) {
            PeerService.removeAssignedErasmus($scope.peer.peer_id, e1.erasmus_id);
          }
        });
        $scope.selectedErasmus.forEach(function(e1) {
          // ... add the ones that are selected but not already assigned
          var add = true;
          $scope.peer.assignedErasmus.forEach(function(e2) {
            add &= e1.erasmus_id != e2.erasmus_id;
          });
          if (add) {
            PeerService.addAssignedErasmus($scope.peer.peer_id, e1.erasmus_id);
          }
        });
      }
      $scope.peer.num_erasmus = $scope.selectedErasmus.length;
      $scope.peer.assignedErasmus = $scope.selectedErasmus.slice();
    };
    // Setup the peer deletion action
    $scope.deletePeer = function() {
      if (confirm('Do you want to delete ' + $scope.peer.name + ' ' + $scope.peer.surname + '\'s profile?\n' +
          '(The assigned Erasmus, if any, won\'t be deleted)')) {
        PeerService.deleteById($scope.peer.peer_id).then(function() {
          $scope.peer = null;
        });
      }
    };
  }]);