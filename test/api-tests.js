
process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
var should = chai.should();

chai.use(chaiHttp);

before(function(done) {
  chai.request(app).delete('/api/students').end(function() {
    // TODO: perform insertions
    done();
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
      res.body.length.should.be.eql(17);
      done();
    });
  });
});

describe('GET faculties', function() {
  it('it should get all the faculties', function(done) {
    chai.request(app).get('/api/faculties').end(function(err, res) {
      res.should.have.status(200);
      res.body.should.be.a('array');
      res.body.length.should.be.eql(10);
      done();
    });
  });
});

describe('GET erasmus', function() {
  it('it should get all the Erasmus', function(done) {
    chai.request(app).get('/api/erasmus').end(function(err, res) {
      res.should.have.status(200);
      res.body.should.be.a('array');
      res.body.length.should.be.eql(0);
      done();
    });
  });
});

describe('GET peers', function() {
  it('it should get all the peers', function(done) {
    chai.request(app).get('/api/peers').end(function(err, res) {
      res.should.have.status(200);
      res.body.should.be.a('array');
      res.body.length.should.be.eql(0);
      done();
    });
  });
});
