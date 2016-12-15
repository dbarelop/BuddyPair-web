'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('AppCtrl', function($scope, $route, $http, $auth) {
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
  }).
  controller('StatsCtrl', function($scope, $route, $http) {
    var handleErrors = function (data) {
      $scope.error = data.data.code;
    };
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
    $http.get('/api/erasmus/count').then(function (data) {
      $scope.male_erasmus = data.data[0].male_erasmus;
      $scope.female_erasmus = data.data[0].female_erasmus;
      $scope.num_erasmus = $scope.male_erasmus + $scope.female_erasmus;
      $scope.numRegistered.data[0][0] = $scope.num_erasmus;
      $scope.genderErasmus.data[0] = $scope.male_erasmus;
      $scope.genderErasmus.data[1] = $scope.female_erasmus;
    }, function (data) {
      $scope.error = data.data.code;
    });
    $http.get('/api/peers/count').then(function (data) {
      $scope.male_peers = data.data[0].male_peers;
      $scope.female_peers = data.data[0].female_peers;
      $scope.num_peers = $scope.male_peers + $scope.female_peers;
      $scope.numRegistered.data[1][0] = $scope.num_peers;
      $scope.genderPeers.data[0] = $scope.male_peers;
      $scope.genderPeers.data[1] = $scope.female_peers;
    }, function (data) {
      $scope.error = data.data.code;
    });
  }).
  controller('ProfileCtrl', function($scope, $route, $http) {
    $scope.$route = $route;
    $http.get('/api/me').then(function (data) {
      $scope.user = data.data;
    });
  }).
  controller('ErasmusCtrl', function($scope, $route, $routeParams, $http) {
    var handleErrors = function (data) {
      $scope.error = data.data.code;
    };
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
    if ($routeParams.id) {
      $scope.erasmus = null;
      $http.get('/api/erasmus/' + $routeParams.id).then(function (data) {
        $scope.erasmus = data.data[0];
        $http.get('/api/erasmus/' + $routeParams.id + '/assignedPeer').then(function (data) {
          $scope.erasmus.assignedPeer = data.data[0];
        }, function (data) {
          $scope.error = data.data.code;
        });
      }, function (data) {
        $scope.error = data.data.code;
      });
    } else {
      $scope.erasmusList = null;
      $http.get('/api/erasmus').then(function (data) {
        $scope.erasmusList = data.data;
      }, function (data) {
        $scope.error = data.data.code;
      });
    }
  }).
  controller('PeerCtrl', function($scope, $route, $routeParams, $http) {
    var handleErrors = function (data) {
      $scope.error = data.data.code;
    };
    $scope.$route = $route;
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
        case 0:
          assignedErasmusFilter = filters.numErasmus.zero;
          break;
        case 1:
          assignedErasmusFilter = filters.numErasmus.one;
          break;
        case 2:
          assignedErasmusFilter = filters.numErasmus.two;
          break;
        case 3:
          assignedErasmusFilter = filters.numErasmus.three;
          break;
      }
      return nameFilter && assignedErasmusFilter;
    };
    if ($routeParams.id) {
      $scope.peer = null;
      $http.get('/api/peer/' + $routeParams.id).then(function (data) {
        $scope.peer = data.data[0];
        $http.get('/api/peer/' + $routeParams.id + '/assignedErasmus').then(function (data) {
          $scope.peer.assignedErasmus = data.data;
        }, function (data) {
          $scope.error = data.data.code;
        });
      });
    } else {
      $scope.peerList = null;
      $http.get('/api/peers').then(function (data) {
        $scope.peerList = data.data;
      }, function (data) {
        $scope.error = data.data.code;
      });
    }
  });
