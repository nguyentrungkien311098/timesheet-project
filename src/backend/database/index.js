// var mysql = require('mysql');

// var db_config = {
//     host: "123.24.206.9",
//     user: "root",
//     password: "Isora@123",
//     database: "isofh_timesheet"
// };

// var connection;

// function handleDisconnect() {
//     connection = mysql.createConnection(db_config); // Recreate the connection, since
//     // the old one cannot be reused.

//     connection.connect(function (err) {              // The server is either down
//         if (err) {                                     // or restarting (takes a while sometimes).
//             console.log('error when connecting to db:', err);
//             setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
//         }                                     // to avoid a hot loop, and to allow our node script to
//     });                                     // process asynchronous requests in the meantime.
//     // If you're also serving http, display a 503 error.
//     connection.on('error', function (err) {
//         console.log('db error', err);
//         switch (err.code) {
//             case "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR":
//             case "PROTOCOL_CONNECTION_LOST":
//                 handleDisconnect();
//                 return;
//             default:
//                 throw err;                                  // server variable configures this)
//         }
//     });
// }

// handleDisconnect();

// module.exports = connection;

var mysql = require("mysql");

var pool = mysql.createPool({
  // connectionLimit: 100,
  // host: "35.220.198.190",
  // user: "root",
  // password: "Isora@123",
  // database: "isofh_timesheet",
  connectionLimit: 100,
  host: "localhost",
  user: "root",
  password: "anhkien98",
  database: "timesheet",
});

var DB = (function() {
  function _query(query, callback) {
    pool.getConnection(function(err, connection) {
      if (err) {
        if (connection) connection.release();
        if (callback) callback(err, null);
      }
      if (!connection) {
        callback(null, err);
        return;
      }


      connection.query(query, function(err, rows) {
        if (connection) connection.release();
        if (callback)
          if (!err) {
            callback(null, rows);
          } else {
            callback(err, null);
          }
      });

      connection.on("error", function(err) {
        connection.release();
        if (callback) callback(err, null);
        throw err;
      });
    });
  }
  function _queryWithParam(query, param, callback) {
    pool.getConnection(function(err, connection) {
      if (err) {
        if (connection) connection.release();
        if (callback) callback(err, null);
        throw err;
      }

      connection.query(query, param, function(err, rows) {
        if (connection) connection.release();
        if (callback)
          if (!err) {
            callback(null, rows);
          } else {
            callback(err, null);
          }
      });

      connection.on("error", function(err) {
        connection.release();
        if (callback) callback(err, null);
        throw err;
      });
    });
  }
  return {
    query: _query,
    queryWithParam: _queryWithParam
  };
})();

module.exports = DB;
