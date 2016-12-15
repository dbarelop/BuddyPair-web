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
    if ($routeParams.id) {
      // Get the Erasmus' information from the API
      $scope.erasmus = {};
      $scope.erasmus.assignedPeer = null;
      $http.get('/api/erasmus/' + $routeParams.id).then(function (data) {
        $scope.erasmus = data.data[0];
        $http.get('/api/erasmus/' + $routeParams.id + '/assignedPeer').then(function (data) {
          $scope.erasmus.assignedPeer = data.data[0];
          $scope.selectedPeer = $scope.erasmus.assignedPeer;
        }, function (data) {
          $scope.error = data.data.code;
        });
      }, function (data) {
        $scope.error = data.data.code;
      });
      // Setup the peer assignment action
      $scope.setSelectedPeer = function(peer) {
        $scope.selectedPeer = peer;
      };
      // TODO: not working!
      var dialog = $('#assignPeerDialog');
      dialog.on('hide.bs.modal', function() {
        alert('modal hiding!');
        $scope.selectedPeer = $scope.erasmus.assignedPeer;
      });
      $scope.availablePeers = null;
      $http.get('/api/peerList').then(function(data) {
        $scope.availablePeers = data.data;
      });
      $scope.updateAssignedPeer = function() {
        // TODO: check for errors in API calls...
        if (!$scope.selectedPeer && $scope.erasmus.assignedPeer) {
          // If there's no selected peer and the Erasmus previously had one, delete it
          $scope.erasmus.assignedPeer.num_erasmus--;
          $http.get('/api/erasmus/' + $scope.erasmus.erasmus_id + '/removeAssignedPeer');
        } else if ($scope.selectedPeer && !$scope.erasmus.assignedPeer) {
          // If there is a new selected peer and the Erasmus didn't have one, add it
          $scope.selectedPeer.num_erasmus++;
          $http.get('/api/erasmus/' + $scope.erasmus.erasmus_id + '/assignPeer/' + $scope.selectedPeer.peer_id);
        } else if ($scope.selectedPeer && $scope.erasmus.assignedPeer && $scope.erasmus.assignedPeer.peer_id != $scope.selectedPeer.peer_id) {
          // If there is a new selected peer, the Erasmus had already an assigned peer and it's not the same as the selected one, replace it
          $scope.selectedPeer.num_erasmus++;
          $scope.erasmus.assignedPeer.num_erasmus--;
          $http.get('/api/erasmus/' + $scope.erasmus.erasmus_id + '/removeAssignedPeer', function() {
            $http.get('/api/erasmus/' + $scope.erasmus.erasmus_id + '/assignPeer/' + $scope.selectedPeer.peer_id);
          });
        }
        $scope.erasmus.assignedPeer = $scope.selectedPeer;
      };
      // Setup the Erasmus deletion action
      $scope.deleteErasmus = function() {
        if (confirm('Do you want to delete ' + $scope.erasmus.name + ' ' + $scope.erasmus.surname + '\'s profile?\n' +
            '(The assigned peer, if any, won\'t be deleted)'))
          $http.get('/api/erasmus/' + $scope.erasmus.erasmus_id + '/delete').then(function(data) {
            $scope.erasmus = null;
          });
      };
    } else {
      $scope.filter_erasmus = function(e) {
        var filters = $scope.filters;
        var nameFilter = !filters.name || (e.name + " " + e.surname).toLowerCase().indexOf(filters.name.toLowerCase()) > -1;
        var assignedPeerFilter = !filters.withPeer || (filters.withPeer == 'all') ||
          (filters.withPeer == 'y' && e.has_peer) || (filters.withPeer == 'n' && !e.has_peer);
        return nameFilter && assignedPeerFilter;
      };
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
    if ($routeParams.id) {
      // Get the peer's information from the API
      $scope.peer = {};
      $http.get('/api/peer/' + $routeParams.id).then(function (data) {
        $scope.peer = data.data[0];
        $http.get('/api/peer/' + $routeParams.id + '/assignedErasmus').then(function (data) {
          $scope.peer.assignedErasmus = data.data;
          $scope.selectedErasmus = [];
          $scope.peer.assignedErasmus.forEach(function(e) {
            $scope.selectedErasmus.push(e);
          });
          $http.get('/api/erasmusList').then(function(data) {
            $scope.availableErasmus = data.data.filter(function(e1) {
              var is_assigned = false;
              $scope.peer.assignedErasmus.forEach(function(e2) {
                is_assigned |= e1.erasmus_id == e2.erasmus_id;
              });
              return !e1.has_peer || is_assigned;
            });
          }, function (data) {
              $scope.error = data.data.code;
          });
        });
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
      // TODO: not working!
      var dialog = $('#assignErasmusDialog');
      dialog.on('hide.bs.modal', function() {
        alert('modal hiding!');
        $scope.selectedErasmus = [];
        $scope.peer.assignedErasmus.forEach(function(e) {
          $scope.selectedErasmus.push(e);
        });
      });
      $scope.availableErasmus = null;
      $scope.updateAssignedErasmus = function() {
        // TODO: check for errors in API calls...
        if ($scope.selectedErasmus.length == 0 && $scope.peer.assignedErasmus != 0) {
          // If there aren't any Erasmus selected and the peer previously had any, delete them
          $http.get('/api/peer/' + $scope.peer.peer_id + '/removeAllAssignedErasmus');
        } else if ($scope.selectedErasmus.length != 0 && $scope.peer.assignedErasmus == 0) {
          // If there is at least one Erasmus selected and the peer didn't have any assigned, add them
          $scope.selectedErasmus.forEach(function(e) {
            $http.get('/api/peer/' + $scope.peer.peer_id + '/assignErasmus/' + e.erasmus_id);
          });
        } else if ($scope.selectedErasmus.length > 0 && $scope.peer.assignedErasmus.length > 0) {
          // If there is at least one Erasmus selected and the peer already has one or more assigned...
          $scope.peer.assignedErasmus.forEach(function(e1) {
            // ... delete the ones that are not selected
            var remove = true;
            $scope.selectedErasmus.forEach(function(e2) {
              remove &= e1.erasmus_id != e2.erasmus_id;
            });
            if (remove)
              $http.get('/api/peer/' + $scope.peer.peer_id + '/removeAssignedErasmus/' + e1.erasmus_id);
          });
          $scope.selectedErasmus.forEach(function(e1) {
            // ... add the ones that are selected but not already assigned
            var add = true;
            $scope.peer.assignedErasmus.forEach(function(e2) {
              add &= e1.erasmus_id != e2.erasmus_id;
            });
            if (add)
              $http.get('/api/peer/' + $scope.peer.peer_id + '/assignErasmus/' + e1.erasmus_id);
          });
        }
        $scope.peer.num_erasmus = $scope.selectedErasmus.length;
        $scope.peer.assignedErasmus = $scope.selectedErasmus;
      };
      // Setup the peer deletion action
      $scope.deletePeer = function() {
        if (confirm('Do you want to delete ' + $scope.peer.name + ' ' + $scope.peer.surname + '\'s profile?\n' +
            '(The assigned Erasmus, if any, won\'t be deleted)'))
          $http.get('/api/peer/' + $scope.peer.peer_id + '/delete').then(function(data) {
            $scope.peer = null;
          });
      };
    } else {
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
          default:
            assignedErasmusFilter = filters.numErasmus.three;
        }
        return nameFilter && assignedErasmusFilter;
      };
      $scope.peerList = null;
      $http.get('/api/peers').then(function (data) {
        $scope.peerList = data.data;
      }, function (data) {
        $scope.error = data.data.code;
      });
    }
  });
