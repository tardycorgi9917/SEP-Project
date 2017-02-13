var assert = require('assert');

var db = require('../database/db');
var seed = require("../database/seeders");
var users = require('../models/users');

describe('User Tests', function(){
    describe('User Creation', function(){
        var firstName = "Eduardo";
        var lastName = "Coronado";
        var email = "eduardo.coronado@gmail.com";
        var password = "ilikethehabs";
        var phoneNumber = "(514)911-1234";
        var profilePicture = "";
        var date = new Date().toISOString().slice(0, 19).replace('T', ' ');

        it('should create user successfully', function(){
            users.create(firstName, lastName, email, password, phoneNumber, profilePicture, date, date,
                function(err, result){
                    assert(err, undefined);
                    assertNotEqual(result.insertId, undefined);
                }
            );
        });

        // it('should not create duplicate user', function(){
        //     users.create(firstName, lastName, email, password, phoneNumber, profilePicture, date, date,
        //         function(err, result){
        //             assert.notEqual(err, undefined);
        //         }
        //     );
        // })

        it('should not create user with null name', function(){
            nullName = null;
            users.create(nullName, lastName, email, password, phoneNumber, profilePicture, date, date,
                function(err, result){
                    assert.notEqual(err, undefined);
                }
            );
        });

        // TODO change

        it('should change phone number', function(){
            var email = "eduardo.coronado@hotmail.com";
            var fields = ["phoneNumber"];
            var values = ["(514)911-4321"];
            users.update(email, fields, values, function(err, result){
                assert(result.affectedRows, 1);
                assert(result.changedRows, 1);
            });
        });

        it('should change user firstName and lastName', function(){
            var email = "eduardo.coronado@hotmail.com";
            var fields = ["firstName", "lastName"];
            var values = ["Michael", "Abdallah"];
            users.update(email, fields, values, function(err, result){
                assert(result.affectedRows, 1);
                assert(result.changedRows, 1);
            });
        });

        it('should change password', function(){
            var email = "eduardo.coronado@hotmail.com";
            var fields = ["password"];
            var values = ["vivamexico"];
            users.update(email, fields, values, function(err, result){
                assert(result.affectedRows, 1);
                assert(result.changedRows, 1);
            });
        });

    });
});
