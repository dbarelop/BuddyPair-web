
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
app.set('view engine', 'jade');
app.use(morgan('dev'));
app.use(bodyParser());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Routes
 */

// serve index and view partials
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// satellizer authentication
app.post('/auth/google', auth.googleAuth);

// JSON API
app.get('/api/me', auth.ensureAuthenticated, auth.findUser);
app.get('/api/erasmusList', auth.ensureAuthenticated, api.erasmusList);
app.get('/api/erasmus/:id', auth.ensureAuthenticated, api.erasmus);
app.get('/api/erasmus/:id/delete', auth.ensureAuthenticated, api.deleteErasmus);
app.get('/api/erasmus/:erasmus_id/assignedPeer', auth.ensureAuthenticated, api.assignedPeer);
app.get('/api/erasmus/:erasmus_id/assignPeer/:peer_id', auth.ensureAuthenticated, api.addAssignment);
app.get('/api/erasmus/:id/removeAssignedPeer', auth.ensureAuthenticated, api.unassignErasmus);
app.get('/api/peerList', auth.ensureAuthenticated, api.peerList);
app.get('/api/peer/:id', auth.ensureAuthenticated, api.peer);
app.get('/api/peer/:id/delete', auth.ensureAuthenticated, api.deletePeer);
app.get('/api/peer/:peer_id/assignedErasmus', auth.ensureAuthenticated, api.assignedErasmus);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

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
