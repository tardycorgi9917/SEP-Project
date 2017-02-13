var assert = require('assert');

var db = require('../database/db');
var seed = require("../database/seeders");
var users = require('../models/users');

describe('User Tests', function () {
    before(function (done) {
        db.connect(db, function (err) {
            seed.up(function () {
                done();
            });
        });
    });

    it('should create user successfully', function () {
        var firstName = "FirstName";
        var lastName = "LastName";
        var email = "firstname.lastname@gmail.com";
        var password = "ilikethehabs";
        var phoneNumber = "(514)911-1234";
        var profilePicture = "";
        var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        users.create(firstName, lastName, email, password, phoneNumber, profilePicture, date, date,
            function (err, result) {
                assert(err, undefined);
                assertNotEqual(result.insertId, undefined);
            }
        );
    });

    it('should not be create user', function () {
        var firstName = null;
        var lastName = "LastName";
        var email = "firstname.lastname@gmail.com";
        var password = "ilikethehabs";
        var phoneNumber = "(514) 911-1234";
        var profilePicture = "";
        var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        users.create(firstName, lastName, email, password, phoneNumber, profilePicture, date, date, function (err, result) {
            assert.notEqual(err, undefined);
        });
    });
});
