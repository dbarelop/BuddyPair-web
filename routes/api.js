/*
 * Serve JSON to our AngularJS client
 */

exports.name = function (req, res) {
  res.json({
    name: 'Bob'
  });
};

var mysql = require('mysql');
var config = require('./config');
var connection = mysql.createConnection(config.database);
connection.connect(function(err) {
  if (!err)
    console.log('Connected to database');
  else
    console.log('Error connecting to database...');
});

exports.erasmusList = function(req, res) {
  var query = 'SELECT * FROM ERASMUS e INNER JOIN STUDENT s ON e.erasmus = s.id';
  connection.query(query, function(err, rows) {
    //connection.end();
    if (err)
      console.log('Error running query \'' + query + '\'');
    else
      res.json(rows);
  });
};

exports.erasmus = function(req, res) {
  var query = "SELECT * FROM ERASMUS e INNER JOIN STUDENT s ON e.erasmus = s.id WHERE e.id = ?";
  connection.query(query, req.params.id, function(err, rows) {
    //connection.end();
    if (err)
      console.log('Error running query \'' + query + '\'');
    else
      res.json(rows);
  });
};

exports.peerList = function(req, res) {
  var query = 'SELECT * FROM PEER p INNER JOIN STUDENT s ON p.peer = s.id';
  connection.query(query, function(err, rows) {
    //connection.end();
    if (err)
      console.log('Error running query \'' + query + '\'');
    else
      res.json(rows);
  });
};

exports.peer = function(req, res) {
  var query = "SELECT * FROM PEER p INNER JOIN STUDENT s ON p.peer = s.id WHERE e.id = ?";
  connection.query(query, req.params.id, function(err, rows) {
    //connection.end();
    if (err)
      console.log('Error running query \'' + query + '\'');
    else
      res.json(rows);
  });
};
