'use strict';

angular.module('BuddyPairApp.controllers')
  .controller('ErasmusListCtrl', ['$scope', '$route', '$location', '$routeParams', 'ErasmusService', 'StudentService', function($scope, $route, $location, $routeParams, ErasmusService, StudentService) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.filters = {
      gender: 'all',
      nationality: '',
      withPeer: 'all'
    };

    $scope.filter_erasmus = function(e) {
      var filters = $scope.filters;
      var nameFilter = !filters.name || (e.name + " " + e.surname).toLowerCase().indexOf(filters.name.toLowerCase()) > -1;
      var genderFilter = !filters.gender || (filters.gender === 'all') || (filters.gender === 'm' && e.gender) || (filters.gender === 'f' && !e.gender);
      var nationalityFilter = !filters.nationality || (filters.nationality === '') || (filters.nationality.country_code === e.nationality);
      var assignedPeerFilter = !filters.withPeer || (filters.withPeer === 'all') || (filters.withPeer === 'y' && e.has_peer) || (filters.withPeer === 'n' && !e.has_peer);
      return nameFilter && genderFilter && nationalityFilter && assignedPeerFilter;
    };
    
    $scope.match_students = function(semester_id) {
      StudentService.matchStudents(semester_id).then(function() {
        $route.reload();
      }, function(err) {
        $scope.error = err.message.code;
      });
    };
    
    $scope.loadData = function(semester_id) {
      ErasmusService.getList(semester_id).then(function(data) {
        $scope.erasmusList = data;
      }, function(err) {
        $scope.error = err.message.code;
      });
    };

    $scope.$watch('selected_semester.value.id', function() {
      $scope.loadData($scope.selected_semester.value.id);
    });
    
  }]);