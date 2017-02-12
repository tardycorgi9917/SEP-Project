var assert = require('assert');
var db = require('../database/db');
var seed = require("../database/seeders");
var users = require('../models/users');

describe('Database', function() {

  before(function(done){
    db.connect(db, function(err) {
      if (err) {
        console.log('Unable to connect to MySQL.')
      } else {
        console.log("DB CONNECTED");
      }
      done();
    })
  });

  describe('Check If DB is empty', function() {
    it('It should ensure DB is empty before seed is called', function() {
      db.get().query("SHOW TABLES", [], function(err, result){
        console.log(result);
        assert.equal(result.length, -1);
      });
    });
  });

  describe('Upload Schema and check if all tables are there', function() {
    it('It should upload database schema', function() {
      seed.up(function() {
        db.get().query("SHOW TABLES", [], function(err, result){
          console.log(JSON.stringify(result));
          assert.equal(result.length, 6);
          seed.down(function() {
              db.get().query("SHOW TABLES", [], function(err, result){
                  console.log(JSON.stringify(result));
                  assert.equal(result.length, 0);
              });
          });
        });
      });
    });
  });

  describe('User Creation', function(){

      it('should create user successfully', function(){
          var firstName = "FirstName";
          var lastName = "LastName";
          var email = "firstname.lastname@gmail.com";
          var password = "ilikethehabs";
          var phoneNumber = "(514)911-1234";
          var profilePicture = "";
          var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
          users.create(firstName, lastName, email, password, phoneNumber, profilePicture, date, date,
              function(err, result){
                  assert(err, undefined);
                  console.log(result.insertId);
                  assert(result.insertId, 7);
              }
          );

      });

      it('should not be create user', function(){
          var firstName = null;
          var lastName = "LastName";
          var email = "firstname.lastname@gmail.com";
          var password = "ilikethehabs";
          var phoneNumber = "(514) 911-1234";
          var profilePicture = "";
          var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
          users.create(firstName, lastName, email, password, phoneNumber, profilePicture, date, date,
              function(err, result){
                  assert.notEqual(err, undefined);
              }
          );
      });
  });

  // describe('Take down the schema and make sure DB is empty', function() {
  //   it('It should remove all tables', function() {
  //     seed.down(function() {
  //         db.get().query("SHOW TABLES", [], function(err, result){
  //             console.log(JSON.stringify(result));
  //             //assert.equal(result.length, 0);
  //         });
  //     });
  //   });
  // });
});
