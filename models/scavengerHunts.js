var db = require("../database/db.js");
var async = require('async');
var scunt = {}

scunt.createScunt = function(name, description, startTime, endTime, done) {
    var now = new Date()

    var values = [name, description, 'PENDING', startTime, endTime, now, now];
    var query = 'INSERT INTO scunt (name, description, status, startTime, endTime, createdAt, updatedAt) VALUES(?, ?, ?, ?, ?, ?, ?)';

    db.get().query(query, values, function(err, result) {
        if (err) {
            done(err, undefined);
        } else {
            done(undefined, result.insertId);
        }
    })
}

scunt.create = function(name,description, startTime, endTime, done){
    async.waterfall([
        //checks if scunt already exist
        function(callback){
            var query = 'SELECT COUNT(*) AS duplicateScunt FROM scunt where name =?';
            var values = [name];
            db.get().query(query , values, function(err,result){
                if (err){
                    callback(err);
                } else if (result[0].duplicateScunt > 0 ) {
                    callback('Scunt with same name already exist')
                } else{
                    callback(null);
                }
            });
        },
        function(callback){
            scunt.createScunt(name,description, startTime, endTime , done);
        }
    ],function(err, scuntId){
        done(err,scuntId);
    });

}

scunt.setStatus = function(id, status, done) {
    var updatedAt = new Date();

    var validStatuses = ['PENDING', 'PUBLISHED', 'STARTED', 'FINISHED'];
    if (validStatuses.indexOf(status) == -1) {
        return done('An invalid status was used');
    }

    var query = 'UPDATE scunt SET status = ?, updatedAt = ? WHERE id = ?';
    var values = [status, updatedAt, id];

    db.get().query(query, values, function(err, result) {
        done(err, result);
    });
}

scunt.start = function(id, done) {
    async.waterfall([
		function(callback) {
            var query = `
                SELECT startTime FROM scunt WHERE id = ?
            `
            var values = [id];

            db.get().query(query, values, function(err, res) {
                if (err) {
                    callback(err);
                } else if (!res[0]) {
                    callback('Scavenger hunt not found');
                } else {
                    var startTime = new Date(Date.parse(res[0].startTime));
                    var now = new Date();
                    if (now < startTime) {
                        callback("The Scavenger Hunt cannot be started yet, it begins on " + startTime.toString());
                    } else {
                        callback(null);
                    }
                }
            })
        },
        function(callback) {
            var query = `
                SELECT status FROM scunt WHERE id = ?
            `
            var values = [id];

            db.get().query(query, values, function(err, res) {
                if (err) {
                    callback(err);
                } else if (!res[0]) {
                    callback('Scavenger hunt not found');
                } else {
                    var status = res[0].status;
                    if (status != "PUBLISHED") {
                        var errMsg = "The Scavenger Hunt cannot be started, it is not PUBLISHED, it is " +res[0].status;
                        callback(errMsg);
                    } else {
                        callback(null);
                    }
                }
            })
        },
		function(callback) {
            scunt.setStatus(id, 'STARTED', function (err, res) {
                callback(err);
            });
        },
        function(callback) {
            var now = new Date();
            var query = `
                INSERT INTO teamTaskRel (teamId, taskId, status, createdAt, updatedAt)
                SELECT teams.id, tasks.id, 'PENDING', ?, ?
                FROM tasks
                JOIN scunt ON tasks.scuntId = scunt.id
                JOIN teams ON teams.scuntId = tasks.scuntId
                WHERE scunt.id = ?
            `
            var values = [now, now, id];

            db.get().query(query, values, function(err, res) {
               callback(err);
            });
        }
    ], function (err) {
        done(err);
    });
}

scunt.close = function(scuntId, done) {
    async.waterfall([
        function(callback){
            var query = 'SELECT COUNT(*) AS uniqueScunt FROM scunt where id =?';
            var values = [scuntId];
            db.get().query(query , values, function(err,result){
                if(err){
                    callback(err);
                } else if(result[0].uniqueScunt == 0 ) {
                    callback('Scunt with this id doesn\'t exist')
                }else{
                    callback(null);
                }
            });
        },
        function(callback) {
            var query = `
                SELECT status FROM scunt WHERE id = ?
            `
            var values = [scuntId];

            db.get().query(query, values, function(err, res) {
                if (err) {
                    callback(err);
                } else if (!res[0]) {
                    callback('Scavenger hunt not found');
                } else {
                    var status = res[0].status;
                    if (status != "STARTED") {
                        var errMsg = "The Scavenger Hunt cannot be finished, it is not STARTED, it is " +res[0].status;
                        callback(errMsg);
                    } else {
                        callback(null);
                    }
                }
            })
        },
        function(callback) {
            scunt.setStatus(scuntId, 'FINISHED', function (err, res) {
                callback(err,scuntId);
            });
        }
    ], function (err,scuntId) {
        done(err,scuntId);
    });
}

scunt.findById = function (id, done) {
    var query = 'SELECT id, name, status, description, startTime AS start, endTime AS end, createdAt AS created, updatedAt AS updated FROM scunt WHERE id = ?';
    var values = [id];
    db.get().query(query, values, function (err, result) {
        if (err) done(err);
        else done(null, result);
    })
}

scunt.update = function (id, name, description, startTime, endTime, done) {
    var UpdatedAt = new Date();

    var values = [name, description, startTime, endTime, UpdatedAt, id];
    var query = 'UPDATE scunt SET name = ?, description = ? , startTime = ?, endTime = ?, updatedAt = ? WHERE id = ?';

    db.get().query(query, values, function (err, result) {
        if (err) {
            done(err, undefined);
        } else {
            done(undefined, result);
        }
    });
}

scunt.list = function (done) {
    var query = 'SELECT id, name, description, status, startTime AS start, endTime AS end, createdAt AS created, updatedAt AS updated '
        + 'FROM scunt';

    db.get().query(query, null, done);
}

scunt.listPublished = function (done)
{
    var query = 'SELECT id, name FROM scunt WHERE status = \'PUBLISHED\'';
    db.get().query(query, null, function(err,result){
        if(err){
            done(err,undefined);
        }else{
            done(undefined,result);
        }
    })
}

scunt.getStatus = function(ScuntId, done)
{
    var value = [ScuntId];
    var query = 'SELECT status FROM scunt WHERE id = ?';

    db.get().query(query, value, done);
}

scunt.delete = function (id, done) {
    var query = 'DELETE FROM scunt WHERE id = ?';
    var values = [id];

    db.get().query(query, values,  function (err) {
        if (err) {
            done(err, undefined);
        } else {
            done(undefined, id);
        }
    });
}

scunt.getTimeRemaining = function(id, done) {
    var query = 'SELECT endTime AS end FROM scunt WHERE id = ?';
    var values = [id];

    db.get().query(query, values, function(err, result) {
        done(err, result);
    });
}

module.exports = scunt;
