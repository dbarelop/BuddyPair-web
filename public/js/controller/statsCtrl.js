'use strict';

angular.module('BuddyPairApp.controllers')
  .controller('StatsCtrl', ['$scope', '$route', '$http', 'ErasmusService', 'PeerService', function($scope, $route, $http, ErasmusService, PeerService) {
    $scope.$route = $route;
    
    $scope.loadData = function(semester_id) {
      $scope.numRegistered = {
        data: [[0], [0]],
        // TODO: fix
        labels: [semester_id + ' / ' + (semester_id + 1)],
        series: ['Erasmus', 'Peers'],
        options: {
          tooltips: {
            enabled: false
          },
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

      $scope.registeredStudentsDiff = {
        data: [[], []],
        series: ['Erasmus', 'Peers'],
        options: {
          tooltips: {
            enabled: false
          },
          legend: {
            display: true
          },
          scales: {
            xAxes: [{
              type: 'time',
              time: {
                displayFormats: {
                  'millisecond': 'DD/MM/YYYY',
                  'second': 'DD/MM/YYYY',
                  'minute': 'DD/MM/YYYY',
                  'hour': 'DD/MM/YYYY',
                  'day': 'DD/MM/YYYY',
                  'week': 'DD/MM/YYYY',
                  'month': 'DD/MM/YYYY',
                  'quarter': 'DD/MM/YYYY',
                  'year': 'DD/MM/YYYY'
                }
              }
            }],
            yAxes: [{
              ticks: {
                min: 0
              }
            }]
          }
        }
      };

      $scope.registeredStudentsCum = {
        data: [[], []],
        series: ['Erasmus', 'Peers'],
        options: {
          tooltips: {
            enabled: false
          },
          legend: {
            display: true
          },
          scales: {
            xAxes: [{
              type: 'time',
              time: {
                displayFormats: {
                  'millisecond': 'DD/MM/YYYY',
                  'second': 'DD/MM/YYYY',
                  'minute': 'DD/MM/YYYY',
                  'hour': 'DD/MM/YYYY',
                  'day': 'DD/MM/YYYY',
                  'week': 'DD/MM/YYYY',
                  'month': 'DD/MM/YYYY',
                  'quarter': 'DD/MM/YYYY',
                  'year': 'DD/MM/YYYY'
                }
              }
            }]
          }
        }
      };

      // https://github.com/markmarkoh/datamaps/blob/master/src/examples/highmaps_world.html
      $scope.mapObject = {
        scope: 'world',
        options: {
          legendHeight: 60
        },
        geographyConfig: {
          hightlightBorderColor: '#EAA9A8',
          highlightBorderWidth: 2
        },
        fills: {
          'HIGH': '#CC4731',
          'MEDIUM': '#306596',
          'LOW': '#667FAF',
          'defaultFill': '#DDDDDD'
        },
        data: {
          'BLR': {
            'fillKey': 'MEDIUM'
          },
          'BLZ': {
            'fillKey': 'HIGH'
          }
        }
      };

      ErasmusService.getCount(semester_id).then(function (count) {
        $scope.male_erasmus = count.male_erasmus;
        $scope.female_erasmus = count.female_erasmus;
        $scope.num_erasmus = $scope.male_erasmus + $scope.female_erasmus;
        $scope.numRegistered.data[0][0] = $scope.num_erasmus;
        $scope.genderErasmus.data[0] = $scope.male_erasmus;
        $scope.genderErasmus.data[1] = $scope.female_erasmus;
      }, function (err) {
        $scope.error = err.message.code;
      });

      PeerService.getCount(semester_id).then(function (count) {
        $scope.male_peers = count.male_peers;
        $scope.female_peers = count.female_peers;
        $scope.num_peers = $scope.male_peers + $scope.female_peers;
        $scope.numRegistered.data[1][0] = $scope.num_peers;
        $scope.genderPeers.data[0] = $scope.male_peers;
        $scope.genderPeers.data[1] = $scope.female_peers;
      }, function (err) {
        $scope.error = err.message.code;
      });

      ErasmusService.getList(semester_id).then(function (erasmus) {
        $scope.registeredStudentsCum.data[0] = [];
        var sum = 0;
        var daily = {};
        erasmus.forEach(function (e) {
          $scope.registeredStudentsCum.data[0].push({y: ++sum, x: new Date(e.register_date)});
          var dateTrunc = new Date(e.register_date);
          dateTrunc.setHours(0);
          dateTrunc.setMinutes(0);
          dateTrunc.setSeconds(0);
          dateTrunc.setMilliseconds(0);
          if (daily[dateTrunc.getTime()]) {
            daily[dateTrunc.getTime()]++;
          } else {
            daily[dateTrunc.getTime()] = 1;
          }
        });
        Object.keys(daily).forEach(function (k) {
          var d = new Date();
          d.setTime(k);
          $scope.registeredStudentsDiff.data[0].push({y: daily[k], x: d});
        });
      }, function (err) {
        $scope.error = err.message.code;
      });

      PeerService.getList(semester_id).then(function (peers) {
        $scope.registeredStudentsCum.data[1] = [];
        var sum = 0;
        var daily = {};
        peers.forEach(function (p) {
          $scope.registeredStudentsCum.data[1].push({y: ++sum, x: new Date(p.register_date)});
          var dateTrunc = new Date(p.register_date);
          dateTrunc.setHours(0);
          dateTrunc.setMinutes(0);
          dateTrunc.setSeconds(0);
          dateTrunc.setMilliseconds(0);
          if (daily[dateTrunc.getTime()]) {
            daily[dateTrunc.getTime()]++;
          } else {
            daily[dateTrunc.getTime()] = 1;
          }
        });
        Object.keys(daily).forEach(function (k) {
          var d = new Date();
          d.setTime(k);
          $scope.registeredStudentsDiff.data[1].push({y: daily[k], x: d});
        });
      }, function (err) {
        $scope.error = err.message.code;
      });
    };

    $scope.$watch('selected_semester.value.id', function() {
      $scope.loadData($scope.selected_semester.value.id);
    });
    
  }]);
