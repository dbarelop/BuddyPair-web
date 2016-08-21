/*
 * Serve JSON to our AngularJS client
 */

var mysql = require('mysql');
var connection;

function handleDisconnect() {
  database = {
    host: process.env.DATABASE_HOST || require('../auth/config').database.host,
    user: process.env.DATABASE_USER || require('../auth/config').database.user,
    password: process.env.DATABASE_PASSWORD || require('../auth/config').database.password,
    database: process.env.DATABASE_NAME || require('../auth/config').database.database,
    dateStrings: true
  };
  connection = mysql.createConnection(database);
  connection.connect(function (err) {
    if (err)
      console.log('Error connecting to database: ', err);
  });
  connection.on('error', function (err) {
    console.log('Database error: ', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST')
      // Reconnect if server closes the connection
      handleDisconnect();
    else
      throw err;
  });
}

handleDisconnect();

exports.erasmusList = function(req, res) {
  var query = 'SELECT e.id AS erasmus_id, s.id AS student_id, st.name AS studies_name, f.name AS faculty_name, e.*, s.*, ' +
    '  EXISTS(SELECT * FROM BUDDY_PAIR WHERE erasmus = e.id) AS has_peer ' +
    'FROM ERASMUS e ' +
    'INNER JOIN STUDENT s ON e.erasmus = s.id ' +
    'LEFT JOIN STUDIES st ON s.studies = st.id ' +
    'LEFT JOIN FACULTY f ON s.faculty = f.id';
  connection.query(query, function(err, rows) {
    if (err)
      console.log('Error running query \'' + query + '\': ', err);
    else
      res.json(rows);
  });
};

exports.erasmusCount = function(req, res) {
  var query = 'SELECT COUNT(CASE s.gender WHEN TRUE THEN 1 ELSE NULL END) AS male_erasmus, COUNT(CASE s.gender WHEN FALSE THEN 1 ELSE NULL END) AS female_erasmus ' +
    'FROM ERASMUS e ' + 
    'INNER JOIN STUDENT s ON e.erasmus = s.id';
  connection.query(query, function(err, rows) {
    if (err)
      console.log('Error running query \'' + query + '\': ', err);
    else
      res.json(rows);
  })
};

exports.erasmus = function(req, res) {
  var query = 'SELECT e.id AS erasmus_id, s.id AS student_id, st.name AS studies_name, f.name AS faculty_name, e.*, s.*, ' +
    '  EXISTS(SELECT * FROM BUDDY_PAIR WHERE erasmus = e.id) AS has_peer ' +
    'FROM ERASMUS e ' +
    'INNER JOIN STUDENT s ON e.erasmus = s.id ' +
    'LEFT JOIN STUDIES st ON s.studies = st.id ' +
    'LEFT JOIN FACULTY f ON s.faculty = f.id ' +
    'WHERE e.id = ?';
  connection.query(query, req.params.id, function(err, rows) {
    if (err)
      console.log('Error running query \'' + query + '\': ', err);
    else
      res.json(rows);
  });
};

exports.peerList = function(req, res) {
  var query = 'SELECT p.id AS peer_id, s.id AS student_id, st.name AS studies_name, f.name AS faculty_name, p.*, s.*, ' +
    '  (SELECT COUNT(*) FROM BUDDY_PAIR WHERE peer = p.id) AS num_erasmus ' +
    'FROM PEER p ' +
    'INNER JOIN STUDENT s ON p.peer = s.id ' +
    'LEFT JOIN STUDIES st ON s.studies = st.id ' +
    'LEFT JOIN FACULTY f ON s.faculty = f.id';
  connection.query(query, function(err, rows) {
    if (err)
      console.log('Error running query \'' + query + '\': ', err);
    else
      res.json(rows);
  });
};

exports.peerCount = function(req, res) {
  var query = 'SELECT COUNT(CASE s.gender WHEN TRUE THEN 1 ELSE NULL END) AS male_peers, COUNT(CASE s.gender WHEN FALSE THEN 1 ELSE NULL END) AS female_peers ' +
    'FROM PEER p ' +
    'INNER JOIN STUDENT s ON p.peer = s.id';
  connection.query(query, function(err, rows) {
    if (err)
      console.log('Error running query \'' + query + '\': ', err);
    else
      res.json(rows);
  })
};

exports.peer = function(req, res) {
  var query = 'SELECT p.id AS peer_id, s.id AS student_id, st.name AS studies_name, f.name AS faculty_name, p.*, s.*, ' +
    '  (SELECT COUNT(*) FROM BUDDY_PAIR WHERE peer = p.id) AS num_erasmus ' +
    'FROM PEER p ' +
    'INNER JOIN STUDENT s ON p.peer = s.id ' +
    'LEFT JOIN STUDIES st ON s.studies = st.id ' +
    'LEFT JOIN FACULTY f ON s.faculty = f.id ' +
    'WHERE p.id = ?';
  connection.query(query, req.params.id, function(err, rows) {
    if (err)
      console.log('Error running query \'' + query + '\': ', err);
    else
      res.json(rows);
  });
};

exports.assignedErasmus = function(req, res) {
  var query = 'SELECT e.id AS erasmus_id, s.id AS student_id, st.name AS studies_name, f.name AS faculty_name, e.*, s.* ' +
    'FROM ERASMUS e ' +
    'INNER JOIN STUDENT s ON e.erasmus = s.id ' +
    'LEFT JOIN STUDIES st ON s.studies = st.id ' +
    'LEFT JOIN FACULTY f ON s.faculty = f.id ' +
    'INNER JOIN BUDDY_PAIR bp ON e.id = bp.erasmus ' +
    'WHERE bp.peer = ?';
  connection.query(query, req.params.peer_id, function(err, rows) {
    if (err)
      console.log('Error running query \'' + query + '\': ', err);
    else 
      res.json(rows);
  });
};

exports.assignedPeer = function(req, res) {
  var query = 'SELECT p.id AS peer_id, s.id AS student_id, st.name AS studies_name, f.name AS faculty_name, p.*, s.* ' +
    'FROM PEER p ' +
    'INNER JOIN STUDENT s ON p.peer = s.id ' +
    'LEFT JOIN STUDIES st ON s.studies = st.id ' +
    'LEFT JOIN FACULTY f ON s.faculty = f.id ' +
    'INNER JOIN BUDDY_PAIR bp ON p.id = bp.peer ' +
    'WHERE bp.erasmus = ?';
  connection.query(query, req.params.erasmus_id, function(err, rows) {
    if (err)
      console.log('Error running query \'' + query + '\': ', err);
    else
      res.json(rows);
  });
};
