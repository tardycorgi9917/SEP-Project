var db = require("../database/db.js");
var async = require('async');

var teams = {}

// Initial values
teams.maxmembers = 20
teams.points = 0

teams.createTeamUserRel = function(teamId, userId, type, done) {
    var query = 'INSERT INTO teamUserRel (teamId, userId, userType, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)';
    
    var now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    var values = [teamId, userId, type, now, now];

    db.get().query(query, values, function(err, result) {
        if (err) {
            done(err);
        } else {
            done(undefined, result.insertId);
        }
    })
}

teams.create = function(name, scuntId, leaderId, done) {
    var now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    async.waterfall([
        function(callback) {
            // Check if user that already has a team is creating another team
            var query = 'SELECT COUNT(*) AS userAlreadyInTeam '
                        + 'FROM teamUserRel '
                        + 'JOIN teams ON teamUserRel.teamId = teams.id '
                        + 'WHERE teamUserRel.userId = ? AND teams.scuntId = ?'

            var values = [leaderId, scuntId];

            db.get().query(query, values, function(err, result) {
                if (err) {
                    callback(err);
                } else if (result[0].userAlreadyInTeam > 0) {
                    callback('User already has a team');
                } else {
                    callback(null);
                }
            });
        },
        function(callback) {
            // Create teams entry
            var query = 'INSERT INTO teams (name, points, maxmembers, scuntId, createdAt, updatedAt) '
                        + 'VALUES(?, ?, ?, ?, ?, ?)';
            var values = [name, scuntId, teams.points, teams.maxmembers, now, now];
                        
            db.get().query(query, values, function (err, result) {
                var teamId = result.insertId;
                callback(err, teamId);
            });
        },
        function(teamId, callback) {
            // Add the user to his team
            teams.createTeamUserRel(teamId, leaderId, 'leader', function (err, result) {
                callback(err, teamId);
            });
        }
    ], function(err, teamId) {
        done(err, teamId);
    });
}

teams.delete = function (teamId, done) {
    var query = 'DELETE FROM teamUserRel WHERE teamId = ?; DELETE FROM teams WHERE id = ?';
    values = [teamId, teamId];

    db.get().query(query, values, function (err, result) {
        done(err);
    })
}

teams.join = function (userId, teamId, allowswitch, done) {
    async.waterfall([
        function(callback) {
            // Validate that the user is not in a team already, unless switching allowed
            var query = 'SELECT COUNT(*) AS userteams '
                        + 'FROM teams AS t1 '
                        + 'JOIN teams AS t2 ON t2.scuntId = t1.scuntId ' 
                        + 'JOIN teamUserRel ON teamUserRel.teamId = t2.id '
                        + 'WHERE teamUserRel.userId = ? AND t1.id = ?';
                        
            values = [userId, teamId];
            db.get().query(query, values, function (err, result) {
                var userteams = result[0].userteams;
                if (err) {
                   callback(err);
                } else if (allowswitch == false && userteams > 0) {
                    callback('User already has a team');
                } else {
                    callback(null);
                }
            })
        },
        function(callback) {
            // Validate that the team still has space left
            var query = 'SELECT maxmembers - teamcount.teamcount AS spaceleft FROM teams '
                        + 'JOIN (SELECT COUNT(*) AS teamcount FROM teamUserRel WHERE teamUserRel.teamId = ?) AS teamcount '
                        + 'WHERE teams.id = ?'
            var values = [teamId];
            
            db.get().query(query, values, function (err, result) {
                var spaceleft = result[0].spaceleft;
                if (err) {
                   callback(err);
                } else if (spaceleft > 0) {
                    callback('Team is at max capacity');
                } else {
                    callback(null);
                }
            })
        }, function(callback) {
            // If user is switching teams, delete the old teamUserRelation
            var query = 'DELETE teamUserRel '
                        + 'FROM teams AS t1 '
                        + 'JOIN teams AS t2 ON t2.scuntId = t1.scuntId ' 
                        + 'JOIN teamUserRel ON teamUserRel.teamId = t2.id '
                        + 'WHERE teamUserRel.userId = ? AND t1.id = ?';
            var values = [userId, teamId];
                        
            db.get().query(query, values, function(err, result) {
                callback(err);
            });
        }, function(callback) {
            // Create the new relation
            teams.createTeamUserRel(teamId, userId, 'participant', function(err, result) {
                callback(err, result);
            });
        }
    ], function(err, result) {
        done(err, result);
    });
}

module.exports = teams;