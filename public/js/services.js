
/* Services */

angular.module('BuddyPairApp.services')
  .service('DatabaseService', function($q, $http) {
    var service = {};

    service.getCountries = function() {
      var deferred = $q.defer();
      $http.get('/api/countries')
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(msg, code) {
          deferred.reject({
            code: code,
            message: msg
          });
          console.log(msg);
        });
      return deferred.promise;
    };

    service.getStudies = function() {
      var deferred = $q.defer();
      $http.get('/api/studies')
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(msg, code) {
          deferred.reject({
            code: code,
            message: msg
          });
          console.log(msg);
        });
      return deferred.promise;
    };

    service.getFaculties = function() {
      var deferred = $q.defer();
      $http.get('/api/faculties')
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(msg, code) {
          deferred.reject({
            code: code,
            message: msg
          });
          console.log(msg);
        });
      return deferred.promise;
    };

    return service;
  })
  .service('ErasmusService', function($q, $http) {
    var service = {};

    service.getList = function() {
      var deferred = $q.defer();
      $http.get('/api/erasmus')
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(msg, code) {
          deferred.reject({
            code: code,
            message: msg
          });
          console.log(msg);
        });
      return deferred.promise;
    };

    service.getCount = function() {
      var deferred = $q.defer();
      $http.get('/api/erasmus/count')
        .success(function(data) {
          deferred.resolve(data[0]);
        })
        .error(function(msg, code) {
          deferred.reject({
            code: code,
            message: msg
          });
          console.log(msg);
        });
      return deferred.promise;
    };

    service.getById = function(id) {
      var deferred = $q.defer();
      $http.get('/api/erasmus/' + id)
        .success(function(data) {
          var erasmus = data[0];
          $http.get('/api/erasmus/' + id + '/assigned_peer')
            .success(function(data) {
              erasmus.assignedPeer = data[0];
              deferred.resolve(erasmus);
            })
            .error(function(msg, code) {
              deferred.reject({
                code: code,
                message: msg
              });
              console.log(msg);
            });
        })
        .error(function(msg, code) {
          deferred.reject({
            code: code,
            message: msg
          });
          console.log(msg);
        });
      return deferred.promise;
    };

    service.deleteById = function(id) {
      var deferred = $q.defer();
      $http.delete('/api/erasmus/' + id)
        .success(function() {
          deferred.resolve();
        })
        .error(function(msg, code) {
          deferred.reject({
            code: code,
            message: msg
          });
          console.log(msg);
        });
      return deferred.promise;
    };

    service.setAssignedPeer = function(erasmus_id, peer_id) {
      var deferred = $q.defer();
      $http.put('/api/erasmus/' + erasmus_id + '/assigned_peer', { peer_id: peer_id })
        .success(function() {
          deferred.resolve();
        })
        .error(function(msg, code) {
          deferred.reject({
            code: code,
            message: msg
          });
          console.log(msg);
        });
      return deferred.promise;
    };

    service.removeAssignedPeer = function(erasmus_id) {
      var deferred = $q.defer();
      $http.delete('/api/erasmus/' + erasmus_id + '/assigned_peer')
        .success(function() {
          deferred.resolve();
        })
        .error(function(msg, code) {
          deferred.reject({
            code: code,
            message: msg
          });
          console.log(msg);
        });
      return deferred.promise;
    };

    service.addErasmus = function(erasmus) {
      var deferred = $q.defer();
      $http.post('/api/erasmus', { erasmus: JSON.stringify(erasmus) })
        .success(function() {
          deferred.resolve();
        })
        .error(function(msg, code) {
          deferred.reject({
            code: code,
            message: msg
          });
          console.log(msg);
        });
      return deferred.promise;
    };

    service.editErasmus = function(id, erasmus) {
      var deferred = $q.defer();
      $http.put('/api/erasmus/' + id, { erasmus: JSON.stringify(erasmus) })
        .success(function() {
          deferred.resolve();
        })
        .error(function(msg, code) {
          deferred.reject({
            code: code,
            message: msg
          });
          console.log(msg);
        });
      return deferred.promise;
    };

    return service;
  })
  .service('PeerService', function($q, $http) {
  var service = {};

  service.getList = function() {
    var deferred = $q.defer();
    $http.get('/api/peers')
      .success(function(data) {
        deferred.resolve(data);
      })
      .error(function(msg, code) {
        deferred.reject({
          code: code,
          message: msg
        });
        console.log(msg);
      });
    return deferred.promise;
  };

  service.getCount = function() {
    var deferred = $q.defer();
    $http.get('/api/peers/count')
      .success(function(data) {
        deferred.resolve(data[0]);
      })
      .error(function(msg, code) {
        deferred.reject({
          code: code,
          message: msg
        });
        console.log(msg);
      });
    return deferred.promise;
  };

  service.getById = function(id) {
    var deferred = $q.defer();
    $http.get('/api/peer/' + id)
      .success(function(data) {
        var peer = data[0];
        $http.get('/api/peer/' + id + '/assigned_erasmus')
          .success(function(data) {
            peer.assignedErasmus = data;
            deferred.resolve(peer);
          })
          .error(function(msg, code) {
            deferred.reject({
              code: code,
              message: msg
            });
            console.log(msg);
          });
      })
      .error(function(msg, code) {
        deferred.reject({
          code: code,
          message: msg
        });
        console.log(msg);
      });
    return deferred.promise;
  };

  service.deleteById = function(id) {
    var deferred = $q.defer();
    $http.delete('/api/peer/' + id)
      .success(function() {
        deferred.resolve();
      })
      .error(function(msg, code) {
        deferred.reject({
          code: code,
          message: msg
        });
        console.log(msg);
      });
    return deferred.promise;
  };

  service.addAssignedErasmus = function(peer_id, erasmus_id) {
    var deferred = $q.defer();
    $http.put('/api/peer/' + peer_id + '/assigned_erasmus', { erasmus_id: erasmus_id })
      .success(function() {
        deferred.resolve();
      })
      .error(function(msg, code) {
        deferred.reject({
          code: code,
          message: msg
        });
        console.log(msg);
      });
    return deferred.promise;
  };

  service.removeAssignedErasmus = function(peer_id, erasmus_id) {
    var deferred = $q.defer();
    $http.delete('/api/peer/' + peer_id + '/assigned_erasmus/' + erasmus_id)
      .success(function() {
        deferred.resolve();
      })
      .error(function(msg, code) {
        deferred.reject({
          code: code,
          message: msg
        });
        console.log(msg);
      });
    return deferred.promise;
  };

  service.removeAllAssignedErasmus = function(peer_id) {
    var deferred = $q.defer();
    $http.delete('/api/peer/' + peer_id + '/assigned_erasmus')
      .success(function() {
        deferred.resolve();
      })
      .error(function(msg, code) {
        deferred.reject({
          code: code,
          message: msg
        });
        console.log(msg);
      });
    return deferred.promise;
  };

  return service;
});