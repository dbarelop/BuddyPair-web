
process.env.NODE_ENV = 'test';
process.env.PORT = 4000;

var chai = require('chai');
var chaiHttp = require('chai-http');
var request = require('request');
var app = require('../app');
var should = chai.should();

var COURSE_YEAR = 2016;

var NUM_STUDIES = 17;
var NUM_FACULTIES = 10;
var COUNTRIES = [ 'US', 'CA', 'AF', 'AL', 'DZ', 'DS', 'AD', 'AO', 'AI', 'AQ', 'AG', 'AR', 'AM', 'AW', 'AU', 'AT', 'AZ', 'BS', 'BH', 'BD', 'BB', 'BY', 'BE', 'BZ', 'BJ', 'BM', 'BT', 'BO', 'BA', 'BW', 'BV', 'BR', 'IO', 'BN', 'BG', 'BF', 'BI', 'KH', 'CM', 'CV', 'KY', 'CF', 'TD', 'CL', 'CN', 'CX', 'CC', 'CO', 'KM', 'CG', 'CK', 'CR', 'HR', 'CU', 'CY', 'CZ', 'DK', 'DJ', 'DM', 'DO', 'TP', 'EC', 'EG', 'SV', 'GQ', 'ER', 'EE', 'ET', 'FK', 'FO', 'FJ', 'FI', 'FR', 'FX', 'GF', 'PF', 'TF', 'GA', 'GM', 'GE', 'DE', 'GH', 'GI', 'GR', 'GL', 'GD', 'GP', 'GU', 'GT', 'GN', 'GW', 'GY', 'HT', 'HM', 'HN', 'HK', 'HU', 'IS', 'IN', 'ID', 'IR', 'IQ', 'IE', 'IL', 'IT', 'CI', 'JM', 'JP', 'JO', 'KZ', 'KE', 'KI', 'KP', 'KR', 'XK', 'KW', 'KG', 'LA', 'LV', 'LB', 'LS', 'LR', 'LY', 'LI', 'LT', 'LU', 'MO', 'MK', 'MG', 'MW', 'MY', 'MV', 'ML', 'MT', 'MH', 'MQ', 'MR', 'MU', 'TY', 'MX', 'FM', 'MD', 'MC', 'MN', 'ME', 'MS', 'MA', 'MZ', 'MM', 'NA', 'NR', 'NP', 'NL', 'AN', 'NC', 'NZ', 'NI', 'NE', 'NG', 'NU', 'NF', 'MP', 'NO', 'OM', 'PK', 'PW', 'PA', 'PG', 'PY', 'PE', 'PH', 'PN', 'PL', 'PT', 'PR', 'QA', 'RE', 'RO', 'RU', 'RW', 'KN', 'LC', 'VC', 'WS', 'SM', 'ST', 'SA', 'SN', 'RS', 'SC', 'SL', 'SG', 'SK', 'SI', 'SB', 'SO', 'ZA', 'GS', 'ES', 'LK', 'SH', 'PM', 'SD', 'SR', 'SJ', 'SZ', 'SE', 'CH', 'SY', 'TW', 'TJ', 'TZ', 'TH', 'TG', 'TK', 'TO', 'TT', 'TN', 'TR', 'TM', 'TC', 'TV', 'UG', 'UA', 'AE', 'GB', 'UM', 'UY', 'UZ', 'VU', 'VA', 'VE', 'VN', 'VG', 'VI', 'WF', 'EH', 'YE', 'YU', 'ZR', 'ZM', 'ZW' ];

var NUM_ERASMUS = 50;
var NUM_PEERS = 50;

chai.use(chaiHttp);

var getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

var getRandomErasmus = function(n, cb) {
  request.get('https://randomuser.me/api/1.1/?nat=au,br,ca,ch,de,dk,es,fi,fr,gb,ie,nl,nz,us&results=' + n, function(err, res, body) {
    var people = JSON.parse(body).results;
    var erasmus = [];
    people.forEach(function(p) {
      var e = {
        name: p.name.first,
        surname: p.name.last,
        gender: p.gender === 'male',
        birthdate: p.dob.split(' ')[0],
        nationality: p.nat,
        email: p.email,
        phone: p.cell,
        studies: getRandomInt(1, NUM_STUDIES + 1),
        faculty: getRandomInt(1, NUM_FACULTIES + 1),
        course_year: COURSE_YEAR,
        register_date: new Date(new Date().getTime() - Math.floor(Math.random() * 10000000000)),
        gender_preference: Math.random() >= 0.5 ? null : Math.random() >= 0.5,
        language_preference: Math.random() >= 0.5 ? null : Math.random() >= 0.5,
        arrival_date: new Date(new Date().getTime() + Math.floor(Math.random() * 10000000000)),
        notes: null,
        notifications: Math.random() >= 0.5
      };
      erasmus.push(e);
    });
    cb(erasmus);
  });
};

var getRandomPeer = function(n, cb) {
  request.get('https://randomuser.me/api/1.1/?nat=es&results=' + n, function(err, res, body) {
    var people = JSON.parse(body).results;
    var erasmus = [];
    people.forEach(function(p) {
      var e = {
        name: p.name.first,
        surname: p.name.last,
        gender: p.gender === 'male',
        birthdate: p.dob.split(' ')[0],
        nationality: p.nat,
        email: p.email,
        phone: p.cell,
        studies: getRandomInt(1, NUM_STUDIES + 1),
        faculty: getRandomInt(1, NUM_FACULTIES + 1),
        course_year: COURSE_YEAR,
        register_date: new Date(new Date().getTime() - Math.floor(Math.random() * 10000000000)),
        gender_preference: Math.random() >= 0.5 ? null : Math.random() >= 0.5,
        nationality_preference: Math.random() >= 0.5 ? null : COUNTRIES[getRandomInt(0, COUNTRIES.length)],
        erasmus_limit: Math.floor(Math.random() * 3) + 1,
        notes: null,
        aegee_member: Math.random() >= 0.5,
        nia: Math.random >= 0.5 ? null : '' + Math.floor(Math.random() * 1000000),
        speaks_english: Math.random() >= 0.5,
        notifications: Math.random() >= 0.5
      };
      erasmus.push(e);
    });
    cb(erasmus);
  });
};

before(function(done) {
  this.timeout(0);
  chai.request(app).delete('/api/students').end(function() {
    getRandomErasmus(NUM_ERASMUS, function(erasmus) {
      getRandomPeer(NUM_PEERS, function(peers) {
        var inserted = 0;
        erasmus.forEach(function(e) {
          chai.request(app).post('/api/erasmus').send({ erasmus: e }).end(function() {
            if (++inserted === erasmus.length + peers.length) {
              done();
            }
          });
        });
        peers.forEach(function(p) {
          chai.request(app).post('/api/peers').send({ peer: p }).end(function() {
            if (++inserted === erasmus.length + peers.length) {
              done();
            }
          });
        });
      });
    });
  });
});

describe('GET countries', function() {
  it('it should get all the countries', function(done) {
    chai.request(app).get('/api/countries').end(function(err, res) {
      res.should.have.status(200);
      res.body.should.be.a('array');
      res.body.length.should.be.eql(242);
      done();
    });
  });
});

describe('GET studies', function() {
  it('it should get all the studies', function(done) {
    chai.request(app).get('/api/studies').end(function(err, res) {
      res.should.have.status(200);
      res.body.should.be.a('array');
      res.body.length.should.be.eql(NUM_STUDIES);
      done();
    });
  });
});

describe('GET faculties', function() {
  it('it should get all the faculties', function(done) {
    chai.request(app).get('/api/faculties').end(function(err, res) {
      res.should.have.status(200);
      res.body.should.be.a('array');
      res.body.length.should.be.eql(NUM_FACULTIES);
      done();
    });
  });
});

describe('GET erasmus', function() {
  it('it should get all the Erasmus', function(done) {
    chai.request(app).get('/api/erasmus/' + COURSE_YEAR).end(function(err, res) {
      res.should.have.status(200);
      res.body.should.be.a('array');
      res.body.length.should.be.eql(NUM_ERASMUS);
      done();
    });
  });
});

describe('GET peers', function() {
  it('it should get all the peers', function(done) {
    chai.request(app).get('/api/peers/' + COURSE_YEAR).end(function(err, res) {
      res.should.have.status(200);
      res.body.should.be.a('array');
      res.body.length.should.be.eql(NUM_PEERS);
      done();
    });
  });
});

describe('GET unnotified students', function() {
  it('it should get all the unnotified peers', function(done) {
    chai.request(app).get('/api/peers/' + COURSE_YEAR + '/unnotified').end(function(err, res) {
      res.should.have.status(200);
      res.body.should.be.a('array');
      res.body.length.should.be.eql(0);
      chai.request(app).get('/api/erasmus/' + COURSE_YEAR + '/unnotified').end(function(err, res) {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(0);
        chai.request(app).get('/api/match/' + COURSE_YEAR).end(function(err, res) {
          res.should.have.status(200);
          chai.request(app).get('/api/peers/' + COURSE_YEAR + '/unnotified').end(function(err, res) {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(NUM_PEERS);
            chai.request(app).get('/api/erasmus/' + COURSE_YEAR + '/unnotified').end(function(err, res) {
              res.should.have.status(200);
              res.body.should.be.a('array');
              res.body.length.should.be.eql(NUM_ERASMUS);
              done();
            });
          });
        });
      });
    });
  });
});
