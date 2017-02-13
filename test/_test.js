var assert = require('assert');
var db = require('../database/db');
var seed = require("../database/seeders");
var users = require('../models/users');

//
// TODO These tests will have to be revisited to make sure they don't break anything else
//

describe('Database', function () {

  before(function (done) {
    db.connect(db, function (err) {
      if (err) console.log('Unable to connect to MySQL.')
      else console.log("DB connected");
      done();
    });
  });

  describe('Check If DB is empty', function () {
    it('It should ensure DB is empty before seed is called', function (done) {
      db.get().query("SHOW TABLES", [], function (err, result) {
        assert.equal(result.length, 0);
        done();
      });
    });
  });

  describe('Upload Schema and check if all tables are there', function (done) {
    it('It should upload database schema', function (done) {
      // TODO do waterfall test
      seed.up(function () {
        db.get().query("SHOW TABLES", [], function (err, result) {
          assert.equal(result.length, 6);
          done();
        });
      });
    });
  });

  describe('Take down schema and make sure DB is empty', function (done) {
    it('It should emptyt he DB', function (done) {
      // TODO do waterfall test
      seed.down(function () {
        db.get().query("SHOW TABLES", [], function (err, result) {
          assert.equal(result.length, 0);
          done();
        });
      });
    });
  });
});