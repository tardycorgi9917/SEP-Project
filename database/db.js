var env = process.env.NODE_ENV || 'development';
var mysql = require('mysql')
  , async = require('async')
  , config = require('./config')[env]
  , schema = require('./schema');

var db = {}

var state = {
  pool: null,
  mode: null,
}

db.connect = function(mode, done) {
  state.pool = mysql.createPool({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.db
  })

  state.mode = mode
  done()
}

db.get = function() {
  return state.pool
}

db.up = function(done) {
  console.log("****************************BEGINNING MIGRATION********************************");

  var pool = state.pool;
  if(!pool) return;

  for (var table in schema) {
    if (schema.hasOwnProperty(table)) {
      var qstr = "CREATE TABLE IF NOT EXISTS `" + schema[table].name  + "` (";
      for(var field in schema[table].fields){
        if (schema[table].fields.hasOwnProperty(field)) {
           qstr += "`" + field + "` "; // column name
           qstr += schema[table].fields[field]; // column options
           qstr += ", ";
        }
      }

      qstr = qstr.slice(0, -2); // remove last comma
      qstr += ");";
      console.log(qstr);

      pool.query(qstr, function(err, result) {
        var i = 0;
        if(err){
          console.log("it fucked up " + err);
        } else {
          console.log("Table " + schema[table].name +" created Succesfully");
        }
      })
    }
  }

  console.log("****************************FINISHED MIGRATION********************************");
}

db.down = function(done){
  console.log("****************************DROPPING ALL TABLES********************************");
  var pool = state.pool;
  if(!pool) return;

  for (var table in schema) {
    if (schema.hasOwnProperty(table)) {
      var query = "DROP TABLE `" + schema[table].name + "`;";
      pool.query(query, [], function(err, result) {
        if(err){
          console.log("it fucked up " + err);
        } else {
          console.log("Table" + schema[table].name +" Removed Succesfully");
        }
      })
    }
  }

  console.log("****************************FINISHED DROPPING TABLES********************************");
}


module.exports = db;