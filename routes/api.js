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

function getErasmusList(cb) {
  var query = 'SELECT e.id AS erasmus_id, s.id AS student_id, st.name AS studies_name, f.name AS faculty_name, e.*, s.*, ' +
    '  EXISTS(SELECT * FROM BUDDY_PAIR WHERE erasmus = e.id) AS has_peer ' +
    'FROM ERASMUS e ' +
    'INNER JOIN STUDENT s ON e.erasmus = s.id ' +
    'LEFT JOIN STUDIES st ON s.studies = st.id ' +
    'LEFT JOIN FACULTY f ON s.faculty = f.id ' +
    'ORDER BY e.register_date ASC';
  connection.query(query, cb);
}

function getErasmusCount(cb) {
  var query = 'SELECT COUNT(CASE s.gender WHEN TRUE THEN 1 ELSE NULL END) AS male_erasmus, COUNT(CASE s.gender WHEN FALSE THEN 1 ELSE NULL END) AS female_erasmus ' +
    'FROM ERASMUS e ' +
    'INNER JOIN STUDENT s ON e.erasmus = s.id';
  connection.query(query, cb);
}

function getErasmus(erasmus_id, cb) {
  var query = 'SELECT e.id AS erasmus_id, s.id AS student_id, st.name AS studies_name, f.name AS faculty_name, e.*, s.*, ' +
    '  EXISTS(SELECT * FROM BUDDY_PAIR WHERE erasmus = e.id) AS has_peer ' +
    'FROM ERASMUS e ' +
    'INNER JOIN STUDENT s ON e.erasmus = s.id ' +
    'LEFT JOIN STUDIES st ON s.studies = st.id ' +
    'LEFT JOIN FACULTY f ON s.faculty = f.id ' +
    'WHERE e.id = ?';
  connection.query(query, erasmus_id, cb);
}

function getPeerList(cb) {
  var query = 'SELECT p.id AS peer_id, s.id AS student_id, st.name AS studies_name, f.name AS faculty_name, p.*, s.*, ' +
    '  (SELECT COUNT(*) FROM BUDDY_PAIR WHERE peer = p.id) AS num_erasmus ' +
    'FROM PEER p ' +
    'INNER JOIN STUDENT s ON p.peer = s.id ' +
    'LEFT JOIN STUDIES st ON s.studies = st.id ' +
    'LEFT JOIN FACULTY f ON s.faculty = f.id ' +
    'ORDER BY p.register_date ASC';
  connection.query(query, cb);
}

function getPeerCount(cb) {
  var query = 'SELECT COUNT(CASE s.gender WHEN TRUE THEN 1 ELSE NULL END) AS male_peers, COUNT(CASE s.gender WHEN FALSE THEN 1 ELSE NULL END) AS female_peers ' +
    'FROM PEER p ' +
    'INNER JOIN STUDENT s ON p.peer = s.id';
  connection.query(query, cb);
}

function getPeer(peer_id, cb) {
  var query = 'SELECT p.id AS peer_id, s.id AS student_id, st.name AS studies_name, f.name AS faculty_name, p.*, s.*, ' +
    '  (SELECT COUNT(*) FROM BUDDY_PAIR WHERE peer = p.id) AS num_erasmus ' +
    'FROM PEER p ' +
    'INNER JOIN STUDENT s ON p.peer = s.id ' +
    'LEFT JOIN STUDIES st ON s.studies = st.id ' +
    'LEFT JOIN FACULTY f ON s.faculty = f.id ' +
    'WHERE p.id = ?';
  connection.query(query, peer_id, cb);
}

function getAssignedErasmus(peer_id, cb) {
  var query = 'SELECT e.id AS erasmus_id, s.id AS student_id, st.name AS studies_name, f.name AS faculty_name, e.*, s.* ' +
    'FROM ERASMUS e ' +
    'INNER JOIN STUDENT s ON e.erasmus = s.id ' +
    'LEFT JOIN STUDIES st ON s.studies = st.id ' +
    'LEFT JOIN FACULTY f ON s.faculty = f.id ' +
    'INNER JOIN BUDDY_PAIR bp ON e.id = bp.erasmus ' +
    'WHERE bp.peer = ?';
  connection.query(query, peer_id, cb);
}

function getAssignedPeer(erasmus_id, cb) {
  var query = 'SELECT p.id AS peer_id, s.id AS student_id, st.name AS studies_name, f.name AS faculty_name, p.*, s.* ' +
    'FROM PEER p ' +
    'INNER JOIN STUDENT s ON p.peer = s.id ' +
    'LEFT JOIN STUDIES st ON s.studies = st.id ' +
    'LEFT JOIN FACULTY f ON s.faculty = f.id ' +
    'INNER JOIN BUDDY_PAIR bp ON p.id = bp.peer ' +
    'WHERE bp.erasmus = ?';
  connection.query(query, erasmus_id, cb);
}

/**
 * Fetches the list of Erasmus students (without data from assigned peers)
 */
exports.erasmusList = function(req, res) {
  getErasmusList(function(err, list) {
    if (err) {
      res.status(503).send(err);
    } else {
      res.json(list);
    }
  });
};

/**
 * Fetches the number of Erasmus
 */
exports.erasmusCount = function(req, res) {
  getErasmusCount(function(err, count) {
    if (err) {
      res.status(503).send(err);
    } else {
      res.json(count);
    }
  });
};

/**
 * Fetches the information of a given Erasmus student (without data from assigned peer)
 * @param req.params.id the Erasmus id
 */
exports.erasmus = function(req, res) {
  var erasmus_id = req.params.id;
  getErasmus(erasmus_id, function(err, erasmus) {
    if (err) {
      res.status(503).send(err);
    } else {
      res.json(erasmus);
    }
  });
};

/**
 * Fetches the list of peer students (without data from assigned Erasmus)
 */
exports.peerList = function(req, res) {
  getPeerList(function(err, list) {
    if (err) {
      res.status(503).send(err);
    } else {
      res.json(list);
    }
  });
};

/**
 * Fetches the number of peer students
 */
exports.peerCount = function(req, res) {
  getPeerCount(function(err, count) {
    if (err) {
      res.status(503).send(err);
    } else {
      res.json(count);
    }
  });
};

/**
 * Fetches the information of a given peer student (without data from assigned Erasmus)
 * @param req.params.id the peer id
 */
exports.peer = function(req, res) {
  var peer_id = req.params.id;
  getPeer(peer_id, function(err, peer) {
    if (err) {
      res.status(503).send(err);
    } else {
      res.json(peer);
    }
  });
};

/**
 * Fetches the information of all the Erasmus assigned to a given peer student
 * @param req.params.peer_id the peer id
 */
exports.assignedErasmus = function(req, res) {
  var peer_id = req.params.peer_id;
  getAssignedErasmus(peer_id, function(err, erasmus) {
    if (err) {
      res.status(503).send(err);
    } else {
      res.json(erasmus);
    }
  });
};

/**
 * Fetches the information of the peer student assigned to a given Erasmus
 * @param req.params.erasmus_id the Erasmus id
 */
exports.assignedPeer = function(req, res) {
  var erasmus_id = req.params.erasmus_id;
  getAssignedPeer(erasmus_id, function(err, peer) {
    if (err) {
      res.status(503).send(err);
    } else {
      res.json(peer);
    }
  });
};

/* INSERTIONS */

function insertStudent(student, cb, errcb) {
  var query = 'INSERT INTO STUDENT (name, surname, gender, birthdate, nacionality, email, phone, studies, faculty) ' +
    'VALUES (?, ?, ?, ?, ?, ?, ?, (SELECT id FROM STUDIES WHERE name = ?), (SELECT id FROM FACULTY WHERE NAME = ?))';
  var q1 = connection.query(query, [student.name, student.surname, student.gender, student.birthdate, student.nacionality, student.email, student.phone, student.studies_name, student.faculty_name], function(err, result) {
    if (err && err.sqlState == '23000') {
      // If the student already exists, fetch their ID and pass it to the callback function
      var query2 = 'SELECT id FROM STUDENT WHERE email = ?';
      var q2 = connection.query(query2, [student.email], function(err, rows) {
        if (err) {
          errcb(err, q2);
        } else {
          cb(rows[0].id);
        }
      });
    } else if (err) {
      errcb(err, q1);
    } else {
      cb(result.insertId);
    }
  });
}

function insertErasmus(erasmus, cb, errcb) {
  var query = 'INSERT INTO ERASMUS (register_date, erasmus, gender_preference, arrival_date, notes) ' +
    'VALUES (?, ?, ?, ?, ?)';
  var q1 = connection.query(query, [erasmus.register_date, erasmus.student_id, erasmus.gender_preference, erasmus.arrival_date, erasmus.notes], function(err, result) {
    if (err && err.sqlState == "23000") {
      // If the Erasmus already exists, fetch their ID and pass it to the callback function
      var query2 = 'SELECT id FROM ERASMUS WHERE erasmus = ?';
      var q2 = connection.query(query2, [erasmus.student_id], function(err, rows) {
        if (err || rows.length == 0) {
          errcb(err, q2);
        } else {
          cb(rows[0].id);
        }
      });
    } else if (err) {
      errcb(err, q1);
    } else {
      cb(result.insertId);
    }
  });
}

function insertMatch(erasmus_id, peer_id, cb) {
  var query = 'INSERT INTO BUDDY_PAIR(erasmus, peer) VALUES (?, ?)';
  connection.query(query, [erasmus_id, peer_id], cb);
}

/**
 * Adds an Erasmus to the database
 * @param req.body.erasmus the Erasmus' information
 */
exports.addErasmus = function(req, res) {
  var handleError = function(err, query) {
    console.log('Error running query \'' + query.sql + '\': ', err);
    res.status(503).send(err);
  };
  var erasmus = JSON.parse(req.body.erasmus);
  insertStudent(erasmus, function(student_id) {
    erasmus.student_id = student_id;
    insertErasmus(erasmus, function(erasmus_id) {
      res.json({ erasmus_id: erasmus_id });
    }, handleError);
  }, handleError);
};

/**
 * Adds a peer student to the database
 * @param req.body.peer the peer's information
 */
exports.addPeer = function(req, res) {
  // TODO: implement
};

/**
 * Assigns a given Erasmus to a given peer student
 * @param req.body.erasmus_id the Erasmus id
 * @param req.params.peer_id the peer id
 * OR
 * @param req.params.erasmus_id the Erasmus id
 * @param req.body.peer_id the peer id
 */
exports.addAssignment = function(req, res) {
  var erasmus_id, peer_id;
  if (req.body.erasmus_id && req.params.peer_id) {
    erasmus_id = req.body.erasmus_id;
    peer_id = req.params.peer_id;
  } else if (req.params.erasmus_id && req.body.peer_id) {
    erasmus_id = req.params.erasmus_id;
    peer_id = req.body.peer_id;
    deleteAssignedPeer(erasmus_id);
  }
  insertMatch(erasmus_id, peer_id, function(err) {
    if (err) {
      res.status(503).send(err);
    } else {
      res.status(200);
    }
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

function deleteErasmus(erasmus_id, cb) {
  var query = 'DELETE FROM ERASMUS WHERE id = ?';
  connection.query(query, erasmus_id, cb);
}

function deletePeer(peer_id, cb) {
  var query = 'DELETE FROM PEER WHERE id = ?';
  connection.query(query, peer_id, cb);
}

function deleteAssignedPeer(erasmus_id, cb) {
  var query = 'DELETE FROM BUDDY_PAIR WHERE erasmus = ?';
  connection.query(query, erasmus_id, cb);
}

function deleteAssignedErasmus(peer_id, erasmus_id, cb) {
  var query = 'DELETE FROM BUDDY_PAIR WHERE erasmus = ? AND peer = ?';
  connection.query(query, [erasmus_id, peer_id], cb);
}

function deleteAllAssginedErasmus(peer_id, cb) {
  var query = 'DELETE FROM BUDDY_PAIR WHERE peer = ?';
  connection.query(query, peer_id, cb);
}

/**
 * Deletes an Erasmus record from the database
 * @param req.params.id the Erasmus id
 */
exports.deleteErasmus = function(req, res) {
  var erasmus_id = req.params.id;
  deleteErasmus(erasmus_id, function(err) {
    if (err) {
      res.status(503).send(err);
    } else {
      res.status(200);
    }
  });
};

/**
 * Deletes a peer record from the database
 * @param req.params.id the peer id
 */
exports.deletePeer = function(req, res) {
  var peer_id = req.params.id;
  deletePeer(peer_id, function(err) {
    if (err) {
      res.status(503).send(err);
    } else {
      res.status(200);
    }
  });
};

/**
 * Removes the assigned peer from a given Erasmus
 * @param req.params.erasmus_id the Erasmus id
 */
exports.removeAssignedPeer = function(req, res) {
  var erasmus_id = req.params.erasmus_id;
  deleteAssignedPeer(erasmus_id, function(err) {
    if (err) {
      res.status(503).send(err);
    } else {
      res.status(200);
    }
  });
};

/**
 * Removes a given assigned Erasmus from a given peer
 * @param req.params.peer_id the peer id
 * @param req.params.erasmus_id the Erasmus id
 */
exports.removeAssignedErasmus = function(req, res) {
  var peer_id = req.params.peer_id;
  var erasmus_id = req.params.erasmus_id;
  deleteAssignedErasmus(peer_id, erasmus_id, function(err) {
    if (err) {
      res.status(503).send(err);
    } else {
      res.status(200);
    }
  });
};

/**
 * Removes the assigned Erasmus (one or more) from a given peer
 * @param req.params.peer_id the peer id
 */
exports.removeAllAssignedErasmus = function(req, res) {
  var peer_id = req.params.peer_id;
  deleteAllAssginedErasmus(peer_id, function(err) {
    if (err) {
      res.status(503).send(err);
    } else {
      res.status(200);
    }
  });
};
