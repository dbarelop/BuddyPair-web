/*
 * REST API that interacts with the MySQL database
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

function getCountryList(cb) {
  var query = 'SELECT * FROM COUNTRY';
  connection.query(query, cb);
}

function getStudiesList(cb) {
  var query = 'SELECT * FROM STUDIES';
  connection.query(query, cb);
}

function getFacultyList(cb) {
  var query = 'SELECT * FROM FACULTY';
  connection.query(query, cb);
}

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

function getUnnotifiedErasmusList(cb) {
  var query = 'SELECT e.id AS erasmus_id, s.id AS student_id, st.name AS studies_name, f.name AS faculty_name, e.*, s.*, ' +
    '  EXISTS(SELECT * FROM BUDDY_PAIR WHERE erasmus = e.id) AS has_peer ' +
    'FROM ERASMUS e ' +
    'INNER JOIN STUDENT s ON e.erasmus = s.id ' +
    'LEFT JOIN STUDIES st ON s.studies = st.id ' +
    'LEFT JOIN FACULTY f ON s.faculty = f.id ' +
    'INNER JOIN BUDDY_PAIR bp ON bp.erasmus = e.id ' +
    'WHERE NOT bp.notified_erasmus ' +
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

function getUnnotifiedPeersList(cb) {
  var query = 'SELECT p.id AS peer_id, s.id AS student_id, st.name AS studies_name, f.name AS faculty_name, p.*, s.*, ' +
    '  (SELECT COUNT(*) FROM BUDDY_PAIR WHERE peer = p.id) AS num_erasmus ' +
    'FROM PEER p ' +
    'INNER JOIN STUDENT s ON p.peer = s.id ' +
    'LEFT JOIN STUDIES st ON s.studies = st.id ' +
    'LEFT JOIN FACULTY f ON s.faculty = f.id ' +
    'INNER JOIN BUDDY_PAIR bp ON bp.peer = p.id ' +
    'WHERE NOT bp.notified_peer ' +
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
 * Fetches the list of available countries
 */
exports.countryList = function(req, res) {
  getCountryList(function(err, list) {
    if (err) {
      res.status(503).send(err);
    } else {
      res.json(list);
    }
  });
};

/**
 * Fetches the list of registered studies
 */
exports.studiesList = function(req, res) {
  getStudiesList(function(err, list) {
    if (err) {
      res.status(503).send(err);
    } else {
      res.json(list);
    }
  });
};

/**
 * Fetches the list of registered faculties
 */
exports.facultyList = function(req, res) {
  getFacultyList(function(err, list) {
    if (err) {
      res.status(503).send(err);
    } else {
      res.json(list);
    }
  });
};

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
 * Fetches the list of Erasmus students (without data from assigned peers)
 * from unnotified Erasmus
 */
exports.unnotifiedErasmusList = function(req, res) {
  getUnnotifiedErasmusList(function(err, list) {
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
 * Fetches the list of peer students (without data from assigned Erasmus)
 * from unnotified students
 */
exports.unnotifiedPeersList = function(req, res) {
  getUnnotifiedPeersList(function(err, list) {
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

function insertStudent(student, cb) {
  var query = 'INSERT INTO STUDENT (name, surname, gender, birthdate, nationality, email, phone, studies, faculty) ';
  query += 'VALUES (?, ?, ?, ?, ';
  query += student.nationality ? '?, ' : '(SELECT country_code FROM COUNTRY WHERE country_name = ?), ';
  query += '?, ?, ';
  query += student.studies ? '?, ' : '(SELECT id FROM STUDIES WHERE name = ?), ';
  query += student.faculty ? '?)' : '(SELECT id FROM FACULTY WHERE name = ?))';
  var values = [student.name, student.surname, student.gender, student.birthdate, student.nationality ? student.nationality : student.nationality_name, 
    student.email, student.phone, student.studies ? student.studies : student.studies_name, student.faculty ? student.faculty : student.faculty_name];
  connection.query(query, values, function(err, result) {
    if (err && err.errno == 1062) {
      // If the student already exists, fetch their ID and pass it to the callback function
      var query2 = 'SELECT id FROM STUDENT WHERE email = ?';
      connection.query(query2, [student.email], function(err, rows) {
        if (err) {
          cb(err);
        } else {
          cb(err, rows[0].id);
        }
      });
    } else if (err) {
      cb(err);
    } else {
      cb(err, result.insertId);
    }
  });
}

function insertErasmus(erasmus, cb) {
  var query = 'INSERT INTO ERASMUS (register_date, erasmus, gender_preference, language_preference, arrival_date, notes) ' +
    'VALUES (?, ?, ?, ?, ?, ?)';
  connection.query(query, [erasmus.register_date, erasmus.student_id, erasmus.gender_preference, erasmus.language_preference, erasmus.arrival_date, erasmus.notes], function(err, result) {
    if (err && err.errno == 1062) {
      // If the Erasmus already exists, fetch their ID and pass it to the callback function
      var query2 = 'SELECT id FROM ERASMUS WHERE erasmus = ?';
      connection.query(query2, erasmus.student_id, function(err, rows) {
        if (err || rows.length == 0) {
          cb(err);
        } else {
          cb(err, rows[0].id);
        }
      });
    } else if (err) {
      cb(err);
    } else {
      cb(err, result.insertId);
    }
  });
}

function insertPeer(peer, cb) {
  var query = 'INSERT INTO PEER (register_date, peer, gender_preference, nationality_preference, erasmus_limit, notes, aegee_member, nia, speaks_english) ';
  query += 'VALUES (?, ?, ?, ';
  query += peer.nationality_preference ? '?, ' : '(SELECT country_code FROM COUNTRY WHERE country_name = ?), ';
  query += '?, ?, ?, ?, ?)';
  var values = [peer.register_date, peer.student_id, peer.gender_preference, peer.nationality_preference ? peer.nationality_preference : peer.nationality_preference_name, 
    peer.erasmus_limit, peer.notes, peer.aegee_member, peer.nia, peer.speaks_english];
  connection.query(query, values, function(err, result) {
    if (err && err.errno == 1062) {
      // If the peer already exists, fetch their ID and pass it to the callback function
      var query2 = 'SELECT id FROM PEER WHERE peer = ?';
      connection.query(query2, peer.student_id, function(err, rows) {
        if (err || rows.length == 0) {
          cb(err);
        } else {
          cb(err, rows[0].id);
        }
      });
    } else if (err) {
      cb(err);
    } else {
      cb(err, result.insertId);
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
  var erasmus = req.body.erasmus;
  insertStudent(erasmus, function(err, student_id) {
    if (err) {
      res.status(503).send(err);
    } else {
      erasmus.student_id = student_id;
      insertErasmus(erasmus, function(err, erasmus_id) {
        if (err) {
          res.status(503).send(err);
        } else {
          res.location('/erasmus/' + erasmus_id).sendStatus(201);
        }
      });
    }
  });
};

/**
 * Adds a peer student to the database
 * @param req.body.peer the peer's information
 */
exports.addPeer = function(req, res) {
  var peer = req.body.peer;
  insertStudent(peer, function(err, student_id) {
    if (err) {
      res.status(503).send(err);
    } else {
      peer.student_id = student_id;
      insertPeer(peer, function(err, peer_id) {
        if (err) {
          res.status(503).send(err);
        } else {
          res.location('/peer/' + peer_id).sendStatus(201);
        }
      });
    }
  });
};

/**
 * Assigns a given Erasmus to a given peer student
 * @param req.body.erasmus_id the Erasmus id
 * @param req.params.peer_id the peer id
 * OR
 * @param req.params.erasmus_id the Erasmus id
 * @param req.body.peer_id the peer id
 */
exports.addMatch = function(req, res) {
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
      if (err.errno == 1062) {
        res.sendStatus(404);
      } else {
        res.status(503).send(err);
      }
    } else {
      res.sendStatus(204);
    }
  });
};

/* MODIFICATIONS */

function updateStudent(id, student, cb) {
  var query = 'UPDATE STUDENT SET name = ?, surname = ?, gender = ?, birthdate = ?, nationality = ?, email = ?, phone = ?, studies = ?, faculty = ? WHERE id = ?';
  connection.query(query, [student.name, student.surname, student.gender, student.birthdate, student.nationality, student.email, student.phone, student.studies, student.faculty, id], cb);
}

function updateErasmus(id, erasmus, cb) {
  var query = 'UPDATE ERASMUS SET register_date = ?, gender_preference = ?, language_preference = ?, arrival_date = ?, notes = ? WHERE id = ?';
  connection.query(query, [erasmus.register_date, erasmus.gender_preference, erasmus.language_preference, erasmus.arrival_date, erasmus.notes, id], cb);
}

function updatePeer(id, peer, cb) {
  var query = 'UPDATE PEER SET register_date = ?, gender_preference = ?, nationality_preference = ?, erasmus_limit = ?, notes = ?, aegee_member = ?, nia = ?, speaks_english = ? WHERE id = ?';
  connection.query(query, [peer.register_date, peer.gender_preference, peer.nationality_preference, peer.arrival_date, peer.notes, peer.aegee_member, peer.nia, peer.speaks_english, id], cb);
}

/**
 * Updates an Erasmus with the new information (the id isn't modified)
 * @param req.params.id the Erasmus' id
 * @param req.body.erasmus the Erasmus' new information
 */
exports.updateErasmus = function(req, res) {
  var erasmus_id = req.params.id;
  var erasmus = req.body.erasmus;
  // TODO: id parameter shouldn't be obtained from data
  updateStudent(erasmus.student_id, erasmus, function(err, result) {
    if (err) {
      res.status(503).send(err);
    } else if (result.affectedRows == 0) {
      res.sendStatus(404);
    } else {
      updateErasmus(erasmus_id, erasmus, function(err, result) {
        if (err) {
          res.status(503).send(err);
        } else {
          res.sendStatus(result.affectedRows == 0 ? 404 : 204);
        }
      });
    }
  });
};

/**
 * Updates a peer student with the new information (the id isn't modified)
 * @param req.params.id the peer's id
 * @param res.body.peer the peer's new information
 */
exports.updatePeer = function(req, res) {
  var peer_id = req.params.id;
  var peer = req.body.peer;
  // TODO: id parameter shouldn't be obtained from data
  updateStudent(peer.student_id, peer, function(err, result) {
    if (err) {
      res.status(503).send(err);
    } else if (result.affectedRows == 0) {
      res.sendStatus(404);
    } else {
      updatePeer(peer, function(err, result) {
        if (err) {
          res.status(503).send(err);
        } else {
          res.sendStatus(result.affectedRows == 0 ? 404 : 204);
        }
      });
    }
  });
};

/* DELETIONS */

function deleteAllStudents(cb) {
  var query = 'DELETE FROM STUDENT';
  connection.query(query, cb);
}

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
 * Deletes all the students (Erasmus and peers)
 */
exports.deleteAllStudents = function(req, res) {
  deleteAllStudents(function(err) {
    if (err) {
      res.status(503).send(err);
    } else {
      res.sendStatus(200);
    }
  });
};

/**
 * Deletes an Erasmus record from the database
 * @param req.params.id the Erasmus id
 */
exports.deleteErasmus = function(req, res) {
  var erasmus_id = req.params.id;
  deleteErasmus(erasmus_id, function(err, result) {
    if (err) {
      res.status(503).send(err);
    } else {
      res.sendStatus(result.affectedRows == 0 ? 404 : 200);
    }
  });
};

/**
 * Deletes a peer record from the database
 * @param req.params.id the peer id
 */
exports.deletePeer = function(req, res) {
  var peer_id = req.params.id;
  deletePeer(peer_id, function(err, result) {
    if (err) {
      res.status(503).send(err);
    } else {
      res.sendStatus(result.affectedRows == 0 ? 404 : 200);
    }
  });
};

/**
 * Removes the assigned peer from a given Erasmus
 * @param req.params.erasmus_id the Erasmus id
 */
exports.removeAssignedPeer = function(req, res) {
  var erasmus_id = req.params.erasmus_id;
  deleteAssignedPeer(erasmus_id, function(err, result) {
    if (err) {
      res.status(503).send(err);
    } else {
      res.sendStatus(result.affectedRows == 0 ? 404 : 200);
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
  deleteAssignedErasmus(peer_id, erasmus_id, function(err, result) {
    if (err) {
      res.status(503).send(err);
    } else {
      res.sendStatus(result.affectedRows == 0 ? 404 : 200);
    }
  });
};

/**
 * Removes the assigned Erasmus (one or more) from a given peer
 * @param req.params.peer_id the peer id
 */
exports.removeAllAssignedErasmus = function(req, res) {
  var peer_id = req.params.peer_id;
  deleteAllAssginedErasmus(peer_id, function(err, result) {
    if (err) {
      res.status(503).send(err);
    } else {
      res.sendStatus(result.affectedRows == 0 ? 404 : 200);
    }
  });
};

/* PROCEDURES */

function matchStudents(cb) {
  var query = 'CALL emparejar()';
  connection.query(query, cb);
}

exports.match = function(req, res) {
  matchStudents(function(err) {
    if (err) {
      res.status(503).send(err);
    } else {
      res.sendStatus(200);
    }
  });
};
