var db = require("../database/db.js");

var teams = {}

teams.createTeamUserRel = function(teamId, userId, type, done) {
    var now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    var values = [teamId, userId, type, now, now];

    db.get().query('INSERT INTO teamUserRel (teamId, userId, userType, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)', values, function(err, result) {
        if (err) {
            done(err, undefined);
        } else {
            done(undefined, result.insertId);
        }
    })
}

teams.create = function(name, scuntId, leaderId, done) {
    var now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    var values = [name, scuntId, now, now];

    db.get().query('INSERT INTO teams (name, points, scuntId, createdAt, updatedAt) VALUES(?, 0, ?, ?, ?)', values, function(err, result) {
        if (err) {
            done(err, undefined);
        } else {
            var teamId = result.insertId;
            teams.createTeamUserRel(teamId, leaderId, 'leader', function(err, result) {
                if (err) {
                    done(err, undefined)
                } else {
                    done(undefined, teamId);
                }
            })
        }
    });
}

module.exports = teams;