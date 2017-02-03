'use strict';

angular.module('BuddyPairApp.controllers')
  .controller('PeerListCtrl', ['$scope', '$route', '$location', '$routeParams', 'PeerService', function($scope, $route, $location, $routeParams, PeerService) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.filters = {
      numErasmus: {
        zero: true,
        one: true,
        two: true,
        three: true
      }
    };

    $scope.filter_peers = function(p) {
      var filters = $scope.filters;
      var nameFilter = !filters.name || (p.name + " " + p.surname).toLowerCase().indexOf(filters.name.toLowerCase()) > -1;
      var assignedErasmusFilter = false;
      switch (p.num_erasmus) {
        case 0: assignedErasmusFilter = filters.numErasmus.zero; break;
        case 1: assignedErasmusFilter = filters.numErasmus.one; break;
        case 2: assignedErasmusFilter = filters.numErasmus.two; break;
        case 3: assignedErasmusFilter = filters.numErasmus.three; break;
        default: assignedErasmusFilter = filters.numErasmus.three;
      }
      return nameFilter && assignedErasmusFilter;
    };
    $scope.peerList = null;
    PeerService.getList().then(function (peerList) {
      $scope.peerList = peerList;
    }, function (err) {
      $scope.error = err.message.code;
    });
  }]);