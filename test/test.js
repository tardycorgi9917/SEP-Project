var assert = require('assert');
var db = require('../database/db');
var seed = require("../database/seeders");

describe('Database', function() {
   db.connect(db, function(err) {
        if (err) {
          console.log('Unable to connect to MySQL.')
          process.exit(1)
        } else {
          console.log("DB CONNECTED");
        }
      })
  describe('Check If DB is empty', function() {
    it('It should ensure DB is empty before seed is called', function() {
      db.get().query("SHOW TABLES", [], function(err, result){
        assert.equal(result.length, 0);
      });
    });
  });

  describe('Uplaid Schema and check if all tables are there', function() {
    it('It should upload database schema is up', function() {
      seed.up();
      db.get().query("SHOW TABLES", [], function(err, result){
        assert.equal(result.length, 6);
      });
    });
  });

  describe('Take down the schema and make sure DB is empty', function() {
    it('It should remove all tables', function() {
      seed.down();
      db.get().query("SHOW TABLES", [], function(err, result){
        assert.equal(result.length, 0);
      });
    });
  });
});