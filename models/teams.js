var db = require("../database/db.js");

var teams = {}

teams.create = function(name, scuntId) {
    var now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    var values = [name, scuntId, now, now];

    db.get().query('INSERT INTO teams (name, points, scuntId, createdAt, updatedAt) VALUES(?, 0, ?, ?, ?)', values, function(err, result) {
        if (err) {
            console.log(err)
        }
    })
}

module.exports = teams;