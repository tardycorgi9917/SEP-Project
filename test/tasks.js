var assert = require('assert');
var async = require('async');

var db = require('../database/db');
var seed = require('../database/seeders');
var tasks = require('../models/tasks');
var scunts = require('../models/scavengerHunts');

describe('Tasks Tests', function () {
    before(function (done) {
        db.connect(db, function (err) {
            seed.up(function () {
                done();
            });
        });
    });

    describe('Tasks Creation Tests', function () {
        it('Tasks should be created successfully', function (done) {
            async.waterfall([
                function (callback) {
                    // Create scavenger hunt
                    var scuntName = 'scuntteamtesttasks';
                    var scuntDesc = 'desc';
                    var scuntStart = new Date();
                    var scuntEnd = new Date();
                    scunts.create(scuntName, scuntDesc, scuntStart, scuntEnd, callback);
                },
                function (scuntId, callback) {
                    // Create user
                    var taskName = 'task number 1';
                    var taskDescription = 'This is the task number 1';
                    var points = 2;
                    tasks.create(taskName, taskDescription, points, scuntId, function (err, id) {
                        assert.notStrictEqual(id, null, 'Could not create tasks, id was null');
                        assert.strictEqual(err, null, 'tasks create has some invalid sql ' + err);
                        callback(err, id);
                    });
                }
            ], function (err, id) {
                assert.notStrictEqual(id, null, 'Could not create tasks, id was null');
                var query = 'SELECT name FROM tasks WHERE id = ?';
                var values = [id];
                db.get().query(query, values, function (err, result) {
                    assert.equal('task number 1', result[0].name);
                    done();
                });
            })
        });
        it('Task should not be created successfully when scavenger hunt does not exist', function (done) {
            var taskName = 'task number 2 test';
            var taskDescription = 'This is the task number 2 not created';
            var points = 2;
            var scuntId = '-1';

            tasks.create(taskName, taskDescription, points, scuntId, function (err, id) {
                assert.strictEqual(id, undefined);
                done();
            });
        });
    });

});