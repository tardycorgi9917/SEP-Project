var db = require("../database/db.js");

var teams = {};

teams.createTeamValidation = function(name, scuntId, leaderId, done) {
    var query = " SELECT COUNT(*) AS Failures FROM ( "
        + "	SELECT 1 AS userAlreadyInTeam FROM teamUserRel JOIN scuntUserRel ON teamUserRel.userId = scuntUserRel.userId WHERE scuntUserRel.userId = ? AND scuntId = ? "
        + "	UNION ALL "
        + "	SELECT 1 AS userNotExists FROM users WHERE ? NOT IN (SELECT id FROM users) "
        + ") AS ValidationFailures "

    var values = [leaderId, scuntId, leaderId];

    db.get().query(query, values, function (err, result) {
        if (err || result[0].Failures > 0) {
            done(err);
        }
        done();
    });
}

module.exports = teams