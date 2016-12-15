'use strict';

angular.module('BuddyPairApp.controllers')
    .controller('ProfileCtrl', ['$scope', '$route', '$http', function($scope, $route, $http) {
        $scope.$route = $route;
        $http.get('/api/me').then(function (data) {
            $scope.user = data.data;
        });
    }]);
