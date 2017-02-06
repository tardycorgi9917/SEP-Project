var mysql = require('mysql')
  , async = require('async')

var env = process.env.NODE_ENV || 'development';
var config = require('./config')[env];
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

  // Add SQL for Creating tables here! Below is an example for the users table
  pool.query("", function(err, result) {
    if(err){
      console.log(err);
    } else {
      console.log("Table Uploaded Succesfully");
    }
  })

  // End of example

  console.log("****************************FINISHED MIGRATION********************************");
}

db.down = function(done){
  console.log("****************************DROPPING ALL TABLES********************************");
  var pool = state.pool;
  if(!pool) return;

  pool.query("", function(err, result) {
    if(err){
      console.log(err);
    } else {
      console.log("Table Uploaded Succesfully");
    }
  })

}


module.exports = db;