// var assert = require('assert');
// var async = require('async');

// var db = require('../database/db');
// var seed = require("../database/seeders");
// var teams = require('../models/teams');

// describe('Teams Tests', function () {
//     describe('Team Creation Tests', function () {
//         it('Team should be created successfully', function () {
//             // TODO Need create scavenger hunt and user to be complete here
//             async.waterfall([
//                 function(callback) {
                    
//                 },
//                 function(callback) {
                    
//                 },
//             ], function(callback) {
                
//             })
//             var name = 'testteamname';
//             var scuntId = '0';
//             var leaderId = '1'
            
//             teams.create(name, scuntId, leaderId, function (err, id) {
//                 assert.strictEqual(err, undefined);
//             });
//         });

//         it('Team should not be created successfully when scavenger hunt does not exist', function () {
//             var name = 'testteamname';
//             var scuntId = '-1';
//             var leaderId = '1';
            
//             teams.create(name, scuntId, leaderId, function (err, id) {
//                 assert.strictEqual(id, undefined);
//             });
//         });

//         it('Cannot have two teams with the same name', function() {
//             var name = 'dupteam';
//             var scuntId = '0'; // TODO create proper scunt // user
//         });

//         it('Cannot create two different teams with the same user', function() {
//             var userId = '0';
//         });
//     });

//     describe('Team Deletion Tests', function() {
//         it('Successful deletion', function() {
            
//         });

//         it('Deleting team that doesn\'t exist should not crash', function() {
            
//         });
//     });

//     describe('Adding user to team and joining', function() {
//         it('Happy path adding team', function() {
            
//         });

//         it('Should not be able to add a player of another team in the same scavenger hunt', function() {
            
//         });

//         it('Happy path joining team', function() {
            
//         });

//         it('Switch team using join', function() {
            
//         });
//     });
// });