
/**
 * Module dependencies
 */

var express = require('express'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  morgan = require('morgan'),
  routes = require('./routes'),
  api = require('./routes/api'),
  http = require('http'),
  https = require('https'),
  fs = require('fs'),
  path = require('path'),
  auth = require('./auth/auth');

var app = module.exports = express();

/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
//app.set('sport', process.env.SPORT || 3443);
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Routes
 */

// serve index and view partials
app.get(    '/', routes.index);
app.get(    '/partials/:name', routes.partials);

// satellizer authentication
app.post(   '/auth/google', auth.googleAuth);

// JSON API
app.get(    '/api/me', auth.ensureAuthenticated, auth.findUser);

app.get(    '/api/countries', api.countryList);
app.get(    '/api/studies', api.studiesList);
app.get(    '/api/faculties', api.facultyList);

app.get(    '/api/erasmus', auth.ensureAuthenticated, api.erasmusList);
app.get(    '/api/erasmus/count', api.erasmusCount);
app.post(   '/api/erasmus', api.addErasmus);

app.get(    '/api/erasmus/:id', auth.ensureAuthenticated, api.erasmus);
app.put(    '/api/erasmus/:id', auth.ensureAuthenticated, api.updateErasmus);
app.delete( '/api/erasmus/:id', auth.ensureAuthenticated, api.deleteErasmus);
app.get(    '/api/erasmus/:erasmus_id/assigned_peer', auth.ensureAuthenticated, api.assignedPeer);
app.put(    '/api/erasmus/:erasmus_id/assigned_peer', auth.ensureAuthenticated, api.addMatch);
app.delete( '/api/erasmus/:erasmus_id/assigned_peer', auth.ensureAuthenticated, api.removeAssignedPeer);

app.get(    '/api/peers', auth.ensureAuthenticated, api.peerList);
app.get(    '/api/peers/count', api.peerCount);
app.post(   '/api/peers', api.addPeer);

app.get(    '/api/peer/:id', auth.ensureAuthenticated, api.peer);
app.put(    '/api/peer/:id', auth.ensureAuthenticated, api.updatePeer);
app.delete( '/api/peer/:id', auth.ensureAuthenticated, api.deletePeer);
app.get(    '/api/peer/:peer_id/assigned_erasmus', auth.ensureAuthenticated, api.assignedErasmus);
app.put(    '/api/peer/:peer_id/assigned_erasmus', auth.ensureAuthenticated, api.addMatch);
app.delete( '/api/peer/:peer_id/assigned_erasmus', auth.ensureAuthenticated, api.removeAllAssignedErasmus);
app.delete( '/api/peer/:peer_id/assigned_erasmus/:erasmus_id', auth.ensureAuthenticated, api.removeAssignedErasmus);

// TODO: make available only for testing?
app.delete( '/api/students', auth.ensureAuthenticated, api.deleteAllStudents);

// redirect all others to the index (HTML5 history)
app.get(    '*', routes.index);

/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

/*var privateKey = fs.readFileSync('./sslcert/server.key', 'utf8');
 var certificate = fs.readFileSync('./sslcert/server.crt', 'utf8');
 var credentials = {
 key: privateKey,
 cert: certificate
 };
 https.createServer(credentials, app).listen(app.get('sport'), function() {
 console.log('Secure Express server listening on port ' + app.get('sport'));
 });*/
