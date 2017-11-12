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
          'defaultFill': '#DDDDDD'
        },
        data: {},
        responsive: true
      };

      ErasmusService.getCount(semester_id).then(function(count) {
        $scope.male_erasmus = count.male_erasmus;
        $scope.female_erasmus = count.female_erasmus;
        $scope.num_erasmus = $scope.male_erasmus + $scope.female_erasmus;
        $scope.numRegistered.data[0][0] = $scope.num_erasmus;
        $scope.genderErasmus.data[0] = $scope.male_erasmus;
        $scope.genderErasmus.data[1] = $scope.female_erasmus;
      }, function(err) {
        $scope.error = err.message.code;
      });
      
      ErasmusService.getCountByCountry(semester_id).then(function(data) {
        var dataset = {};
        var paletteScale = d3.scale.linear().domain([0, Math.max.apply(Math, data.map(function(e) { return e.num_erasmus }))]).range(['#EFEFFF', '#02386F']);
        data.forEach(function(e) {
          dataset[e.country_code_iso3166_1] = { numberOfErasmus: e.num_erasmus, fillColor: paletteScale(e.num_erasmus) };
        });

        $scope.mapObject = {
          scope: 'world',
          options: {
            legendHeight: 60
          },
          geographyConfig: {
            hightlightBorderColor: '#EAA9A8',
            highlightBorderWidth: 2,
            highlightFillColor: function(geo) { return geo['fillColor'] || '#DDDDDD' },
            popupTemplate: function(geo, data) {
              if (data) {
                return ['<div class="hoverinfo">',
                          '<strong>', geo.properties.name, '</strong>',
                            '<br>Number of Erasmus: <strong>', data.numberOfErasmus, '</strong>',
                        '</div>'].join('');
              }
            }
          },
          fills: {
            'defaultFill': '#DDDDDD'
          },
          data: dataset,
          responsive: true
        };
      }, function(err) {
        $scope.error = err.message.code;
      });

      PeerService.getCount(semester_id).then(function(count) {
        $scope.male_peers = count.male_peers;
        $scope.female_peers = count.female_peers;
        $scope.num_peers = $scope.male_peers + $scope.female_peers;
        $scope.numRegistered.data[1][0] = $scope.num_peers;
        $scope.genderPeers.data[0] = $scope.male_peers;
        $scope.genderPeers.data[1] = $scope.female_peers;
      }, function(err) {
        $scope.error = err.message.code;
      });

      ErasmusService.getList(semester_id).then(function(erasmus) {
        $scope.registeredStudentsCum.data[0] = [];
        var sum = 0;
        var daily = {};
        erasmus.forEach(function(e) {
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
        Object.keys(daily).forEach(function(k) {
          var d = new Date();
          d.setTime(k);
          $scope.registeredStudentsDiff.data[0].push({y: daily[k], x: d});
        });
      }, function(err) {
        $scope.error = err.message.code;
      });

      PeerService.getList(semester_id).then(function(peers) {
        $scope.registeredStudentsCum.data[1] = [];
        var sum = 0;
        var daily = {};
        peers.forEach(function(p) {
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
        Object.keys(daily).forEach(function(k) {
          var d = new Date();
          d.setTime(k);
          $scope.registeredStudentsDiff.data[1].push({y: daily[k], x: d});
        });
      }, function(err) {
        $scope.error = err.message.code;
      });
    };

    $scope.$watch('selected_semester.value.id', function() {
      $scope.loadData($scope.selected_semester.value.id);
    });
    
  }]);
