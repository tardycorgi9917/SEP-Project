var assert = require('assert');

var db = require('../database/db');
var seed = require("../database/seeders");
var users = require('../models/users');

describe('User Tests', function(){
    before(function(done){
        db.connect(db, function(){
            seed.down(function(){
                seed.up(function(){
                    done();
                });
            });
        });
    });

    describe('User creation', function(){
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
                    assert(result.insertId, 1);
                }
            );

        })
    });

    describe('User should not be created', function(){
        var firstName = null;
        var lastName = "LastName";
        var email = "firstname.lastname@gmail.com";
        var password = "ilikethehabs";
        var phoneNumber = "(514) 911-1234";
        var profilePicture = "";
        var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        users.create(firstName, lastName, email, password, phoneNumber, profilePicture, date, date,
            function(err, result){
                assert.notStrictEqual(err, undefined);
            }
        );
    });
});
