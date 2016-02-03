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
  var query = 'SELECT e.id AS erasmus_id, s.id AS student_id, st.name AS studies_name, f.name AS faculty_name, e.*, s.* ' +
    'FROM ERASMUS e ' +
    'INNER JOIN STUDENT s ON e.erasmus = s.id ' +
    'LEFT JOIN STUDIES st ON s.studies = st.id ' +
    'LEFT JOIN FACULTY f ON s.faculty = f.id';
  connection.query(query, function(err, rows) {
    //connection.end();
    if (err)
      console.log('Error running query \'' + query + '\'');
    else
      res.json(rows);
  });
};

exports.erasmus = function(req, res) {
  var query = 'SELECT e.id AS erasmus_id, s.id AS student_id, st.name AS studies_name, f.name AS faculty_name, e.*, s.* ' +
    'FROM ERASMUS e ' +
    'INNER JOIN STUDENT s ON e.erasmus = s.id ' +
    'LEFT JOIN STUDIES st ON s.studies = st.id ' +
    'LEFT JOIN FACULTY f ON s.faculty = f.id ' +
    'WHERE s.id = ?';
  connection.query(query, req.params.id, function(err, rows) {
    //connection.end();
    if (err)
      console.log('Error running query \'' + query + '\'');
    else
      res.json(rows);
  });
};

exports.peerList = function(req, res) {
  var query = 'SELECT p.id AS peer_id, s.id AS student_id, st.name AS studies_name, f.name AS faculty_name, p.*, s.* ' +
    'FROM PEER p ' +
    'INNER JOIN STUDENT s ON p.peer = s.id ' +
    'LEFT JOIN STUDIES st ON s.studies = st.id ' +
    'LEFT JOIN FACULTY f ON s.faculty = f.id';
  connection.query(query, function(err, rows) {
    //connection.end();
    if (err)
      console.log('Error running query \'' + query + '\'');
    else
      res.json(rows);
  });
};

exports.peer = function(req, res) {
  var query = 'SELECT p.id AS peer_id, s.id AS student_id, st.name AS studies_name, f.name AS faculty_name, p.*, s.* ' +
    'FROM PEER p ' +
    'INNER JOIN STUDENT s ON p.peer = s.id ' +
    'LEFT JOIN STUDIES st ON s.studies = st.id ' +
    'LEFT JOIN FACULTY f ON s.faculty = f.id ' +
    'WHERE s.id = ?';
  connection.query(query, req.params.id, function(err, rows) {
    //connection.end();
    if (err)
      console.log('Error running query \'' + query + '\'');
    else
      res.json(rows);
  });
};
