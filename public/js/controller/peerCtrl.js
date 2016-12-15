'use strict';

angular.module('BuddyPairApp.controllers')
    .controller('PeerCtrl', ['$scope', '$route', '$routeParams', '$http', 'PeerService', 'ErasmusService', function($scope, $route, $routeParams, $http, PeerService, ErasmusService) {
        var handleErrors = function (data) {
            $scope.error = data.data.code;
        };
        $scope.$route = $route;
        if ($routeParams.id) {
            // Get the peer's information from the API
            $scope.peer = {};
            $scope.peer.assignedErasmus = [];
            $scope.selectedErasmus = [];
            PeerService.getById($routeParams.id).then(function(peer) {
                $scope.peer = peer;
                peer.assignedErasmus.forEach(function(e) { $scope.selectedErasmus.push(e); });
                ErasmusService.getList().then(function(erasmusList) {
                    $scope.availableErasmus = erasmusList.filter(function(e1) {
                        var isAssigned = false;
                        peer.assignedErasmus.forEach(function(e2) { isAssigned |= e1.erasmus_id == e2.erasmus_id; });
                        return !e1.has_peer || isAssigned;
                    });
                });
            }, function(err) {
                $scope.error = err;
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
                $scope.peer.assignedErasmus = $scope.selectedErasmus;
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
                $scope.error = err;
            });
        }
    }]);