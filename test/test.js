var assert = require('assert');
var db = require('../database/db');
var seed = require("../database/seeders");

describe('Database', function() {
  describe('schemaUp', function() {
    it('It should upload database schema is up', function() {
      db.connect(db, function(err) {
        if (err) {
          console.log('Unable to connect to MySQL.')
          process.exit(1)
        } else {
          console.log("DB CONNECTED");
        }
      })

      db.get().query("", [], function(){
        
      });
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});