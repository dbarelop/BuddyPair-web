'use strict';

angular.module('BuddyPairApp.controllers')
  .controller('AppCtrl', ['$scope', '$route', '$http', '$auth', 'DatabaseService', function($scope, $route, $http, $auth, DatabaseService) {
    $scope.$route = $route;
    $http.get('/api/me').then(function (data) {
      $scope.user = data.data;
    });
    $scope.authenticate = function(provider) {
      $auth.authenticate(provider).then(function() {
        console.log('Succesfully signed in with ' + provider);
        $http.get('/api/me').then(function (data) {
          $scope.user = data.data;
        });
      }).
      catch(function(err) {
        if (err.error) {
          console.log(err.error);
        } else if (err.data) {
          console.log(err.data.message, err.status);
        } else {
          console.log(err);
        }
      });
    };
    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };
    $scope.logout = function() {
      $auth.logout().then(function() {
        console.log('Logged out');
      });
    };

    $scope.countries = [];
    $scope.studies = [];
    $scope.faculties = [];
    $scope.semesters = [];
    $scope.selected_semester = {item: ''};
    DatabaseService.getCountries().then(function(list) { $scope.countries = list; });
    DatabaseService.getStudies().then(function(list) { $scope.studies = list; });
    DatabaseService.getFaculties().then(function(list) { $scope.faculties = list; });
    DatabaseService.getSemesters().then(function(list) {
      $scope.semesters = list;
      $scope.selected_semester.value = $scope.semesters[0];
    });
  }]);