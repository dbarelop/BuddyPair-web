'use strict';

angular.module('BuddyPairApp.controllers')
  .controller('ErasmusListCtrl', ['$scope', '$route', '$routeParams', 'ErasmusService', function($scope, $route, $routeParams, ErasmusService) {
    $scope.$route = $route;
    $scope.filters = {
      withPeer: 'all'
    };

    $scope.filter_erasmus = function(e) {
      var filters = $scope.filters;
      var nameFilter = !filters.name || (e.name + " " + e.surname).toLowerCase().indexOf(filters.name.toLowerCase()) > -1;
      var assignedPeerFilter = !filters.withPeer || (filters.withPeer == 'all') ||
        (filters.withPeer == 'y' && e.has_peer) || (filters.withPeer == 'n' && !e.has_peer);
      return nameFilter && assignedPeerFilter;
    };

    ErasmusService.getList().then(function(data) {
      $scope.erasmusList = data;
    }, function(err) {
      $scope.error = err.message.code;
    });
  }]);