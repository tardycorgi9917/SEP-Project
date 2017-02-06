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
      var query = "CREATE TABLE IF NOT EXISTS `" + schema[table].name  + "` (";
      for(var field in schema[table].fields){
        if (schema[table].fields.hasOwnProperty(field)) {
           query += field + " ";
           query += schema[table].fields[field];
           query += ", ";
        }
      }
      query = query.slice(0, -2); // remove last comma
      query += ")";
      console.log(query);
    }
  }

  // pool.query("", function(err, result) {
  //       if(err){
  //         console.log(err);
  //       } else {
  //         console.log("Table Uploaded Succesfully");
  //       }
  //     })

  console.log("****************************FINISHED MIGRATION********************************");
}

db.down = function(done){
  console.log("****************************DROPPING ALL TABLES********************************");
  var pool = state.pool;
  if(!pool) return;


}


module.exports = db;