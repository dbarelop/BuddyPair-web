'use strict';

angular.module('BuddyPairApp.controllers')
  .controller('StatsCtrl', ['$scope', '$route', '$http', 'ErasmusService', 'PeerService', function($scope, $route, $http, ErasmusService, PeerService) {
    $scope.$route = $route;
    $scope.numRegistered = {
      data: [[0], [0]],
      labels: ['2016'],
      series: ['Erasmus', 'Peers'],
      options: {
        legend: {
          display: true
        },
        scales: {
          yAxes: [{
            display: true,
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    };
    $scope.genderErasmus = {
      data: [0, 0],
      labels: ['Male', 'Female']
    };
    $scope.genderPeers = {
      data: [0, 0],
      labels: ['Male', 'Female']
    };
    ErasmusService.getCount().then(function (count) {
      $scope.male_erasmus = count.male_erasmus;
      $scope.female_erasmus = count.female_erasmus;
      $scope.num_erasmus = $scope.male_erasmus + $scope.female_erasmus;
      $scope.numRegistered.data[0][0] = $scope.num_erasmus;
      $scope.genderErasmus.data[0] = $scope.male_erasmus;
      $scope.genderErasmus.data[1] = $scope.female_erasmus;
    }, function (err) {
      $scope.error = err.message.code;
    });
    PeerService.getCount().then(function (count) {
      $scope.male_peers = count.male_peers;
      $scope.female_peers = count.female_peers;
      $scope.num_peers = $scope.male_peers + $scope.female_peers;
      $scope.numRegistered.data[1][0] = $scope.num_peers;
      $scope.genderPeers.data[0] = $scope.male_peers;
      $scope.genderPeers.data[1] = $scope.female_peers;
    }, function (err) {
      $scope.error = err.message.code;
    });
  }]);
