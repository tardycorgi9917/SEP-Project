var assert = require('assert');
var async = require('async');

var db = require('../database/db');
var seed = require('../database/seeders');
var tasks = require('../models/tasks');
var scunts = require('../models/scavengerHunts');
var users = require('../models/users');
var teams = require('../models/teams');


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
        it('Cannot have two tasks in the same scunt with the same name', function (done) {
            async.waterfall([
                function (callback) {
                    // Create scavenger hunt
                    var scuntName = 'scuntteamtesttasks2';
                    var scuntDesc = 'desc2';
                    var scuntStart = new Date();
                    var scuntEnd = new Date();
                    scunts.create(scuntName, scuntDesc, scuntStart, scuntEnd, callback);
                },
                function (scuntId, callback) {
                    // Create task
                    var taskName = 'task number 2';
                    var taskDescription = 'This is the task number 2';
                    var points = 2;
                    tasks.create(taskName, taskDescription, points, scuntId, function (err, id) {
                        assert.notStrictEqual(id, null, 'Could not create tasks, id was null');
                        assert.strictEqual(err, null, 'tasks create has some invalid sql ' + err);
                        callback(err, scuntId);
                    });
                },
                function (scuntId, callback) {
                    // Create task
                    var taskName = 'task number 2';
                    var taskDescription = 'This is the task number 2';
                    var points = 2;
                    tasks.create(taskName, taskDescription, points, scuntId, function (err, id) {
                        assert.strictEqual(id, undefined, 'Task should not have been created');
                        assert.strictEqual(err, 'A task with this name already exists in this scavenger hunt');
                        callback(null);
                    });
                }
            ], function (err) {
                assert.strictEqual(err, null, 'unknown error occured');
                done();
            });
        });
    });

    describe('Task Deletion Tests', function () {
        it('Successful deletion', function (done) {
            async.waterfall([
                function (callback) {
                    // Create scavenger hunt
                    var scuntName = 'scuntteamtesttasks3';
                    var scuntDesc = 'desc';
                    var scuntStart = new Date();
                    var scuntEnd = new Date();
                    scunts.create(scuntName, scuntDesc, scuntStart, scuntEnd, callback);
                },
                function (scuntId, callback) {
                    // Create user
                    var taskName = 'task number 3';
                    var taskDescription = 'This is the task number 3';
                    var points = 2;
                    tasks.create(taskName, taskDescription, points, scuntId, function (err, id) {
                        assert.notStrictEqual(id, null, 'Could not create tasks, id was null');
                        assert.strictEqual(err, null, 'tasks create has some invalid sql ' + err);
                        callback(err, id);
                    });
                },
                function (taskId, callback) {
                    tasks.delete(taskId, function (err) {
                        callback(err, taskId);
                    });
                },
                function (taskId, callback) {
                    var query = 'SELECT COUNT(*) AS taskcount FROM tasks WHERE id = ?';
                    var values = [taskId];

                    db.get().query(query, values, function (err, result) {
                        assert.equal(0, result[0].taskcount);
                        callback(null);
                    });
                }
            ], function (err) {
                assert.strictEqual(err, null, 'unknown error occured on happy path team deletion');
                done();
            });
        });

        it('should not crash when the task doesn\'t exist', function (done) {
            tasks.delete(-1, function (err) {
                done();
            });
        });
    });

    describe('Task Editing Tests', function () {
        it('Successful editing', function (done) {
            async.waterfall([
                function (callback) {
                    // Create scavenger hunt
                    var scuntName = 'scuntteamtesttasks4';
                    var scuntDesc = 'desc';
                    var scuntStart = new Date();
                    var scuntEnd = new Date();
                    scunts.create(scuntName, scuntDesc, scuntStart, scuntEnd, callback);
                },
                function (scuntId, callback) {
                    // Create task
                    var taskName = 'task number 4';
                    var taskDescription = 'This is the task number 4';
                    var points = 2;
                    tasks.create(taskName, taskDescription, points, scuntId, function (err, id) {
                        assert.notStrictEqual(id, null, 'Could not create tasks, id was null');
                        assert.strictEqual(err, null, 'tasks create has some invalid sql ' + err);
                        callback(err, id);
                    });
                },
                function (taskId,callback) {
                    // Create scavenger hunt 2
                    var scuntName = 'scuntteamtesttasks4 bis';
                    var scuntDesc = 'desc bis';
                    var scuntStart = new Date();
                    var scuntEnd = new Date();
                    scunts.create(scuntName, scuntDesc, scuntStart, scuntEnd, function (err,scuntId) {
                        callback(err, taskId,scuntId);
                    });
                },
                function (taskId,scuntId, callback) {
                    // Edit task
                    var taskDict = {};
                    taskDict["name"] = 'task number 4 bis';
                    taskDict["description"] = 'This is the task number 4 bis';
                    taskDict["points"] = 3;
                    taskDict["scuntId"] = scuntId;
                    tasks.edit(taskId,taskDict, function (err,taskId) {
                        callback(err, taskId,scuntId);
                    });
                },
                function (taskId,scuntId, callback) {
                    var query = 'SELECT name,description,points,scuntId FROM tasks WHERE id = ?';
                    var values = [taskId];

                    db.get().query(query, values, function (err, result) {
                        assert.equal('task number 4 bis', result[0].name);
                        assert.equal('This is the task number 4 bis', result[0].description);
                        assert.equal(3, result[0].points);
                        assert.equal(scuntId, result[0].scuntId);
                        callback(null);
                    });
                }
            ], function (err) {
                assert.strictEqual(err, null, 'unknown error occured on happy path team deletion');
                done();
            });
        });

        it('should not crash when the task doesn\'t exist', function (done) {
            tasks.edit(-1,{}, function (err) {
                done();
            });
        });
    });

    describe('Task Status Updates', function(){
        var now = new Date();
        it('Should Successfully Update Task Status', function(done){
            async.waterfall([
                function(callback){
                    users.create("shane", "Shane", "McIntosh", "shane@test.com", "mcintosh","5149136710", true, null, now, function(err, userId){
                        if(err) callback(err);
                        else callback(null, userId);
                    });
                }, function(userId, callback){
                    scunts.create("Loool", "Let's get litt up", now, now, function(err, scuntId){
                        if(err) callback(err);
                        else callback(null, scuntId);
                    });
                }, function(scuntId, callback){
                    tasks.create("Catch A Squirrel", "Use a Pokeball", 40, scuntId, function(err, taskId){
                        if(err) callback(err);
                        else callback(null, taskId, scuntId);
                    });
                }, function(taskId, scuntId, callback){
                    users.create("keheliya", "Keheliya", "Gallaba", "keheliya@test.com", "gallaba","5149136711", false, null, now, function(err, userId){
                        if(err) callback(err);
                        else callback(null, userId, scuntId, taskId);
                    });
                }, function(userId, scuntId, taskId, callback){
                    teams.create("AllStarz", 300, 20, scuntId, userId, function(err, teamId){
                        if(err) callback(err);
                        else callback(null, teamId, taskId);
                    });
                }, function(teamId, taskId, callback){
                    tasks.getTaskStatus(teamId, taskId, function(err,result){
                        if(err) callback(err);
                        else{
                            var status = result[0].status;
                            assert(status, "Incomplete");
                            callback(null, teamId, taskId);
                        }
                    })
                }, function(teamId, taskId, callback){
                    tasks.updateTaskStatus(teamId, taskId, "In Progress", function(err, result){
                        if(err) callback(err);
                        else callback(null, teamId, taskId);
                    });
                }, function(teamId, taskId, callback){
                    tasks.getTaskStatus(teamId, taskId, function(err,result){
                        if(err) callback(err);
                        else {
                            var status = result[0].status;
                            assert(status, "In Progress");
                            callback(null, teamId, taskId);
                        }
                    })
                }
            ], function(err){
                done();
            });
        });
    });
});
