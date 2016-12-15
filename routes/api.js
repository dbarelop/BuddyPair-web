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

/* QUERIES */

/**
 * Fetches the list of Erasmus students (without data from assigned peers)
 */
exports.erasmusList = function(req, res) {
  var query = 'SELECT e.id AS erasmus_id, s.id AS student_id, st.name AS studies_name, f.name AS faculty_name, e.*, s.*, ' +
    '  EXISTS(SELECT * FROM BUDDY_PAIR WHERE erasmus = e.id) AS has_peer ' +
    'FROM ERASMUS e ' +
    'INNER JOIN STUDENT s ON e.erasmus = s.id ' +
    'LEFT JOIN STUDIES st ON s.studies = st.id ' +
    'LEFT JOIN FACULTY f ON s.faculty = f.id ' +
    'ORDER BY e.register_date ASC';
  connection.query(query, function(err, rows) {
    if (err) {
      console.log('Error running query \'' + query + '\': ', err);
      res.status(503).send(err);
    } else {
      res.json(rows);
    }
  });
};

exports.erasmusCount = function(req, res) {
  var query = 'SELECT COUNT(CASE s.gender WHEN TRUE THEN 1 ELSE NULL END) AS male_erasmus, COUNT(CASE s.gender WHEN FALSE THEN 1 ELSE NULL END) AS female_erasmus ' +
    'FROM ERASMUS e ' +
    'INNER JOIN STUDENT s ON e.erasmus = s.id';
  connection.query(query, function(err, rows) {
    if (err) {
      console.log('Error running query \'' + query + '\': ', err);
      res.status(503).send(err);
    } else {
      res.json(rows);
    }
  })
};

/**
 * Fetches the information of a given Erasmus student (without data from assigned peer)
 * @param req.params.id the Erasmus id
 */
exports.erasmus = function(req, res) {
  var query = 'SELECT e.id AS erasmus_id, s.id AS student_id, st.name AS studies_name, f.name AS faculty_name, e.*, s.*, ' +
    '  EXISTS(SELECT * FROM BUDDY_PAIR WHERE erasmus = e.id) AS has_peer ' +
    'FROM ERASMUS e ' +
    'INNER JOIN STUDENT s ON e.erasmus = s.id ' +
    'LEFT JOIN STUDIES st ON s.studies = st.id ' +
    'LEFT JOIN FACULTY f ON s.faculty = f.id ' +
    'WHERE e.id = ?';
  connection.query(query, req.params.id, function(err, rows) {
    if (err) {
      console.log('Error running query \'' + query + '\': ', err);
      res.status(503).send(err);
    } else {
      res.json(rows);
    }
  });
};

/**
 * Fetches the list of peer students (without data from assigned Erasmus)
 */
exports.peerList = function(req, res) {
  var query = 'SELECT p.id AS peer_id, s.id AS student_id, st.name AS studies_name, f.name AS faculty_name, p.*, s.*, ' +
    '  (SELECT COUNT(*) FROM BUDDY_PAIR WHERE peer = p.id) AS num_erasmus ' +
    'FROM PEER p ' +
    'INNER JOIN STUDENT s ON p.peer = s.id ' +
    'LEFT JOIN STUDIES st ON s.studies = st.id ' +
    'LEFT JOIN FACULTY f ON s.faculty = f.id ' +
    'ORDER BY p.register_date ASC';
  connection.query(query, function(err, rows) {
    if (err) {
      console.log('Error running query \'' + query + '\': ', err);
      res.status(503).send(err);
    } else {
      res.json(rows);
    }
  });
};

exports.peerCount = function(req, res) {
  var query = 'SELECT COUNT(CASE s.gender WHEN TRUE THEN 1 ELSE NULL END) AS male_peers, COUNT(CASE s.gender WHEN FALSE THEN 1 ELSE NULL END) AS female_peers ' +
    'FROM PEER p ' +
    'INNER JOIN STUDENT s ON p.peer = s.id';
  connection.query(query, function(err, rows) {
    if (err) {
      console.log('Error running query \'' + query + '\': ', err);
      res.status(503).send(err);
    } else {
      res.json(rows);
    }
  })
};

/**
 * Fetches the information of a given peer student (without data from assigned Erasmus)
 * @param req.params.id the peer id
 */
exports.peer = function(req, res) {
  var query = 'SELECT p.id AS peer_id, s.id AS student_id, st.name AS studies_name, f.name AS faculty_name, p.*, s.*, ' +
    '  (SELECT COUNT(*) FROM BUDDY_PAIR WHERE peer = p.id) AS num_erasmus ' +
    'FROM PEER p ' +
    'INNER JOIN STUDENT s ON p.peer = s.id ' +
    'LEFT JOIN STUDIES st ON s.studies = st.id ' +
    'LEFT JOIN FACULTY f ON s.faculty = f.id ' +
    'WHERE p.id = ?';
  connection.query(query, req.params.id, function(err, rows) {
    if (err) {
      console.log('Error running query \'' + query + '\': ', err);
      res.status(503).send(err);
    } else {
      res.json(rows);
    }
  });
};

/**
 * Fetches the information of all the Erasmus assigned to a given peer student
 * @param req.params.peer_id the peer id
 */
exports.assignedErasmus = function(req, res) {
  var query = 'SELECT e.id AS erasmus_id, s.id AS student_id, st.name AS studies_name, f.name AS faculty_name, e.*, s.* ' +
    'FROM ERASMUS e ' +
    'INNER JOIN STUDENT s ON e.erasmus = s.id ' +
    'LEFT JOIN STUDIES st ON s.studies = st.id ' +
    'LEFT JOIN FACULTY f ON s.faculty = f.id ' +
    'INNER JOIN BUDDY_PAIR bp ON e.id = bp.erasmus ' +
    'WHERE bp.peer = ?';
  connection.query(query, req.params.peer_id, function(err, rows) {
    if (err) {
      console.log('Error running query \'' + query + '\': ', err);
      res.status(503).send(err);
    } else {
      res.json(rows);
    }
  });
};

/**
 * Fetches the information of the peer student assigned to a given Erasmus
 * @param req.params.erasmus_id the Erasmus id
 */
exports.assignedPeer = function(req, res) {
  var query = 'SELECT p.id AS peer_id, s.id AS student_id, st.name AS studies_name, f.name AS faculty_name, p.*, s.* ' +
    'FROM PEER p ' +
    'INNER JOIN STUDENT s ON p.peer = s.id ' +
    'LEFT JOIN STUDIES st ON s.studies = st.id ' +
    'LEFT JOIN FACULTY f ON s.faculty = f.id ' +
    'INNER JOIN BUDDY_PAIR bp ON p.id = bp.peer ' +
    'WHERE bp.erasmus = ?';
  connection.query(query, req.params.erasmus_id, function(err, rows) {
    if (err) {
      console.log('Error running query \'' + query + '\': ', err);
      res.status(503).send(err);
    } else {
      res.json(rows);
    }
  });
};

/* INSERTIONS */

/**
 * Adds an Erasmus to the database
 * @param req.params.erasmus the Erasmus' information
 */
exports.addErasmus = function(req) {
  // TODO: implement
};

/**
 * Adds a peer student to the database
 * @param req.params.peer the peer's information
 */
exports.addPeer = function(req) {
  // TODO: implement
};

/**
 * Assigns a given Erasmus to a given peer student
 * @param req.params.erasmus_id the Erasmus id
 * @param req.params.peer_id the peer id
 */
exports.addAssignment = function(req) {
  var query = 'INSERT INTO BUDDY_PAIR(erasmus, peer) VALUES (?, ?)';
  connection.query(query, [req.params.erasmus_id, req.params.peer_id], function(err) {
    if (err)
      console.log('Error running insertion \'' + query + '\': ', err);
  });
};

/* MODIFICATIONS */

/**
 * Updates an Erasmus with the new information (the id can't change)
 * @param req.params.erasmus the Erasmus' information
 */
exports.updateErasmus = function(req) {
  // TODO: implement
};

/**
 * Updates a peer student with the new information (the id can't change)
 * @param res.params.peer the peer's information
 */
exports.updatePeer = function(res) {
  // TODO: implement
};

/* DELETIONS */

/**
 * Deletes an Erasmus record from the database
 * @param req.params.id the Erasmus id
 */
exports.deleteErasmus = function(req) {
  var query = 'DELETE FROM ERASMUS WHERE id = ?';
  connection.query(query, req.params.id, function(err) {
    if (err)
      console.log('Error running query \'' + query + '\': ', err);
  });
};

/**
 * Deletes a peer record from the database
 * @param req.params.id the peer id
 */
exports.deletePeer = function(req) {
  var query = 'DELETE FROM PEER WHERE id = ?';
  connection.query(query, req.params.id, function(err) {
    if (err)
      console.log('Error running query \'' + query + '\': ', err);
  });
};

/**
 * Removes the assigned peer from a given Erasmus
 * @param req.params.erasmus_id the Erasmus id
 */
exports.removeAssignedPeer = function(req) {
  var query = 'DELETE FROM BUDDY_PAIR WHERE erasmus = ?';
  connection.query(query, req.params.erasmus_id, function(err) {
    if (err)
      console.log('Error running query \'' + query + '\': ', err);
  });
};

/**
 * Removes a given assigned Erasmus from a given peer
 * @param req.params.erasmus_id the Erasmus id
 * @param req.params.peer_id the peer id
 */
exports.removeAssignedErasmus = function(req) {
  var query = 'DELETE FROM BUDDY_PAIR WHERE erasmus = ? AND peer = ?';
  connection.query(query, [req.params.erasmus_id, req.params.peer_id], function(err) {
    if (err)
      console.log('Error running query \'' + query + '\': ', err);
  });
};

/**
 * Removes the assigned Erasmus (one or more) from a given peer
 * @param req.params.peer_id the peer id
 */
exports.removeAllAssignedErasmus = function(req) {
  var query = 'DELETE FROM BUDDY_PAIR WHERE peer = ?';
  connection.query(query, req.params.peer_id, function(err) {
    if (err)
      console.log('Error running query \'' + query + '\': ', err);
  });
};
