'use strict';

angular.module('BuddyPairApp.controllers')
  .controller('PeerListCtrl', ['$scope', '$route', '$location', '$routeParams', 'PeerService', 'StudentService', function($scope, $route, $location, $routeParams, PeerService, StudentService) {
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

    $scope.match_students = function(semester_id) {
      StudentService.matchStudents(semester_id).then(function() {
        $route.reload();
      }, function(err) {
        $scope.error = err.message.code;
      });
    };

    $scope.export_peers = function(semester_id) {
      var content = PeerService.exportToCSV($scope.peerList);
      var blob = new Blob([content], { type: 'text/plain' });
      $scope.url = (window.URL || window.webkitURL).createObjectURL(blob);
    };

    $scope.copy_emails_to_clipboard = function() {
      var emails = $scope.peerList.filter(function(p) { return p.notifications; }).map(function(p) { return p.email; }).join(' ');

      var dummyElem = document.createElement('textarea');
      dummyElem.value = emails;
      dummyElem.setAttribute('readonly', '');
      dummyElem.style = { visibility: 'hidden' };
      document.body.appendChild(dummyElem);
      dummyElem.select();
      document.execCommand('copy');
      document.body.removeChild(dummyElem);
      $scope.infomsg = 'Emails copied to clipboard';
    };
    
    $scope.loadData = function(semester_id) {
      PeerService.getList(semester_id).then(function (peerList) {
        $scope.peerList = peerList;
      }, function (err) {
        $scope.error = err.message.code;
      });
    };

    $scope.$watch('selected_semester.value.id', function() {
      $scope.loadData($scope.selected_semester.value.id);
    });
    
  }]);