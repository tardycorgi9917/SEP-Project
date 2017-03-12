var db = require("../database/db.js");
var async = require('async');

var teams = {}

teams.createTeamUserRel = function(teamId, userId, type, done) {
    var query = 'INSERT INTO teamUserRel (teamId, userId, userType, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)';
    
    var now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    var values = [teamId, userId, type, now, now];

    db.get().query(query, values, done);
}

teams.removeTeamUserRel = function(teamId, userId, done) {
    var query = 'DELETE FROM teamUserRel WHERE teamId = ? AND userId = ?';
    var values = [teamId, userId];

    db.get().query(query, values, function(err, result) {
        done(err);
    });
}

teams.create = function(name, points, maxmembers, scuntId, leaderId, done) {
    var now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    async.waterfall([
        function(callback) {
            // Check if there is a team with the same name
            var query = 'SELECT COUNT(*) AS duplicateTeam FROM teams WHERE name = ? AND scuntId = ?';
            var values = [name, scuntId];

            db.get().query(query, values, function(err, result) {
                if (err) {
                    callback(err);
                } else if (result[0].duplicateTeam > 0) {
                    callback('A team with this name already exists in this scavenger hunt');
                } else {
                    callback(null);
                }
            });
        },
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
            var values = [name, points, maxmembers, scuntId, now, now];
                        
            db.get().query(query, values, function (err, result) {
                if (err) {
                    callback(err);
                } else {
                    var teamId = result.insertId;
                    callback(undefined, teamId)
                }
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

    async.waterfall([
        function(callback){
            var query = 'SELECT scuntId FROM teams where id = ?';
            values = [teamId];

            db.get().query(query, values, function(err, result)
            {
                if(err)
                {
                    callback(err);
                }else if(result.length == 0)
                {
                    callback('team does not exist');
                }else
                {
                    callback(undefined, result[0].scuntId);
                }

            });
        },
        function(ScuntId,callback)
        {
            
            var query = 'SELECT startTime, endTime FROM scunt where id = ?';
            values = [ScuntId];
            currentDate = new Date();

            db.get().query(query, values ,function(err, result){
                if(err)
                {
                    callback(err);
                }else if(new Date(result[0].startTime) < currentDate && new Date(result[0].endTime) > currentDate )
                {
                    callback('Cannot Delete Teams during scunt');
                }else
                {
                    callback(undefined);
                }

            });
        },
        function(callback)
        {            
            var query = 'DELETE FROM teamUserRel WHERE teamId = ?; DELETE FROM teams WHERE id = ?';
            values = [teamId, teamId];

            db.get().query(query, values, function (err, result) {
                callback(err);
            })
        }

    ], function(err)
    {
        done(err);
    });

}

teams.join = function (userId, teamId, allowswitch, done) {
    async.waterfall([
        function(callback) {
            if (allowswitch) {
                // join
                callback(null, userId);
            } else {
                // add to team, userId is a username
                var query = 'SELECT id FROM users WHERE username = ?';
                var values = [userId];

                db.get().query(query, values, function(err, res) {
                    if (err || res.length == 0) {
                        callback('User not found');
                    } else {
                        callback(null, res[0].id);
                    }
                });
            }
        },
        function(id, callback) {
            // Validate that the user is not in a team already, unless switching allowed
            var query = 'SELECT COUNT(*) AS userteams '
                        + 'FROM teams AS t1 '
                        + 'JOIN teams AS t2 ON t2.scuntId = t1.scuntId ' 
                        + 'JOIN teamUserRel ON teamUserRel.teamId = t2.id '
                        + 'WHERE teamUserRel.userId = ? AND t1.id = ?';
                        
            values = [id, teamId];
            db.get().query(query, values, function (err, result) {
                var userteams = result[0].userteams;
                if (err) {
                   callback(err);
                } else if (allowswitch == false && userteams > 0) {
                    callback('User already has a team');
                } else {
                    callback(null, id);
                }
            })
        },
        function(id, callback) {
            // Validate that the team still has space left
            var query = 'SELECT maxmembers - teamcount.teamcount AS spaceleft FROM teams '
                        + 'JOIN (SELECT COUNT(*) AS teamcount FROM teamUserRel WHERE teamUserRel.teamId = ?) AS teamcount '
                        + 'WHERE teams.id = ?'
            var values = [teamId, teamId];
            
            db.get().query(query, values, function (err, result) {
                if (err) {
                   callback(err);
                } else if (result[0].spaceleft <= 0) {
                    callback('Team is at max capacity');
                } else {
                    callback(null, id);
                }
            })
        }, function(id, callback) {
            // If user is switching teams, delete the old teamUserRelation
            var query = 'DELETE teamUserRel '
                        + 'FROM teams AS t1 '
                        + 'JOIN teams AS t2 ON t2.scuntId = t1.scuntId ' 
                        + 'JOIN teamUserRel ON teamUserRel.teamId = t2.id '
                        + 'WHERE teamUserRel.userId = ? AND t1.id = ?';
            var values = [id, teamId];
                        
            db.get().query(query, values, function(err, result) {
                callback(err, id);
            });
        }, function(id, callback) {
            // Create the new relation
            teams.createTeamUserRel(teamId, id, 'participant', function(err, result) {
                callback(err, id);
            });
        }
    ], function(err, id) {
        done(err, id);
    });
}

teams.list = function(done) {
    async.waterfall([
        function(callback) {
            // Get all teams
            var query = 'SELECT * FROM teams';
            db.get().query(query, [], function(err, res) {
                callback(err, res);
            });
        },
        function(teams, callback) {
            // Get all teamUserRelations
            var query = 'SELECT * FROM teamUserRel';
            db.get().query(query, [], function(err, res) {
                for (var i in teams) {
                    teams[i].teamUsers = [];
                    for (var j in res) {
                        if (res[j].teamId == teams[i].id) {
                            teams[i].teamUsers.push(res[j]);
                        }
                    }
                }
                callback(err, teams);
            });
        }
    ], function(err, result) {
        done(err, result);
    })
}

teams.update = function(teamId, name, points, maxmembers, scuntId, done) {
    var now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    var query = "UPDATE `teams` SET `name`=?,`points`=?,`maxMembers`=?,`scuntId`=?,`updatedAt`=? WHERE `id`=?";
    var values = [name, points, maxmembers, scuntId, now, teamId];
    db.get().query(query, values, function(err, res){
        done(err);
    });
}

teams.getPoints = function(teamId, done) {
    var query = 'SELECT SUM(t1.points) '
                    + 'FROM tasks AS t1 '
                    + 'JOIN teamTaskRel AS t2 ON t1.id = t2.taskId '
                    + 'WHERE t2.teamId = ? AND t2.status = "APPROVED"'

    var values = [teamId];

    db.get().query(query, values, function(err, result) {
        done(err, result);
    });
}

module.exports = teams;