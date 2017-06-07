
var jwt = require('jwt-simple'),
  request = require('request'),
  moment = require('moment');

var TOKEN_SECRET = process.env.TOKEN_SECRET || require('./config').auth.TOKEN_SECRET;
var GOOGLE_SECRET = process.env.GOOGLE_SECRET || require('./config').auth.GOOGLE_SECRET;
var ALLOWED_USERS = process.env.ALLOWED_USERS ? process.env.ALLOWED_USERS.split(',') : require('./config').auth.ALLOWED_USERS;
var DEBUG = process.env.NODE_ENV ? process.env.NODE_ENV === 'test' : false;

/*
 |--------------------------------------------------------------------------
 | Generate JSON Web Token
 |--------------------------------------------------------------------------
 */
function createJWT(profile) {
  var payload = {
    sub: profile,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, TOKEN_SECRET);
}

/*
 |--------------------------------------------------------------------------
 | Login with Google
 |--------------------------------------------------------------------------
 */
exports.googleAuth = function(req, res) {
  var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
  var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: GOOGLE_SECRET,
    redirect_uri: req.body.redirectUri,
    grant_type: 'authorization_code'
  };

  // Step 1. Exchange authorization code for access token.
  request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
    var accessToken = token.access_token;
    var headers = { Authorization: 'Bearer ' + accessToken };

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {
      if (profile.error) {
        return res.status(500).send({ message: profile.error.message });
      }

      var token = createJWT(profile);
      res.send({ token: token });
    });
  });
};

/*
 |--------------------------------------------------------------------------
 | Login Required Middleware
 |--------------------------------------------------------------------------
 */
exports.ensureAuthenticated = function(req, res, next) {
  if (DEBUG) {
    next();
  } else {
    if (!req.headers.authorization) {
      return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
    }

    // Static authentication implementation
    if (req.headers.authorization === TOKEN_SECRET) {
      next();
    }

    var token = req.headers.authorization.split(' ')[1];

    var payload = null;
    try {
      payload = jwt.decode(token, TOKEN_SECRET);
    }
    catch (err) {
      return res.status(401).send({ message: err.message });
    }

    if (payload.exp <= moment().unix()) {
      return res.status(401).send({ message: 'Token has expired' });
    }

    // TODO: improve access control (based on email)
    if (ALLOWED_USERS.indexOf(payload.sub.email) > -1) {
      req.profile = payload.sub;
      next();
    } else {
      return res.status(403).send({ message: 'You don\'t have permission to access the application' });
    }
  }
};

exports.findUser = function(req, res) {
  res.send(req.profile);
};
