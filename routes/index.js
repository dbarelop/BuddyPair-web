
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');
};

exports.erasmusList = function(req, res) {
  res.render('erasmusList');
};

exports.erasmus = function(req, res) {
  res.render('erasmus');
};

exports.peerList = function(req, res) {
  res.render('peerList');
};

exports.peer = function(req, res) {
  res.render('peer');
};
