var db = require("../database/db.js");
var async = require('async');

var tasks = {}

// Initial values
tasks.points = 0;

tasks.create = function(taskName, description, points, scuntId, done) {
    var now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    async.waterfall([
        function(callback) {
            // Check if there is a task with the same name
            // might be unnecessary
            // TODO
            var query = 'SELECT COUNT(*) AS duplicateTask FROM tasks WHERE name = ? AND scuntId = ?';
            var values = [taskName, scuntId];

            db.get().query(query, values, function(err, result) {
                if (err) {
                    callback(err);
                } else if (result[0].duplicateTask > 0) {
                    callback('A task with this name already exists in this scavenger hunt');
                } else {
                    callback(null);
                }
            });
        },
        function(callback) {
            // Create task entry
            var query = 'INSERT INTO tasks (name, description, points, scuntId, createdAt, updatedAt) '
                        + 'VALUES(?, ?, ?, ?, ?, ?)';
            var values = [taskName, description, points, scuntId, now, now];
            console.log('values');
            console.log(values);
            db.get().query(query, values, function (err, result) {
                if (err) {
                    callback(err);
                } else {
                    var taskId = result.insertId;
                    callback(undefined, taskId)
                }
            });
        }
    ], function(err, taskId) {
        done(err, taskId);
    });
}

tasks.delete = function (taskId, done) {
    var query = 'DELETE FROM tasks WHERE id = ?';
    values = [taskId];

    db.get().query(query, values, function (err, result) {
        done(err);
    })
}

module.exports = tasks;