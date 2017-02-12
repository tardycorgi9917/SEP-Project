var db = require("../database/db.js");

var users = {}

users.create = function(firstname, lastname, email, done) {
    var values = [firstname, lastname, email, new Date().toISOString().slice(0, 19).replace('T', ' ')];

    db.get().query('INSERT INTO users (firstname, lastname, email, createdAt) VALUES(?, ?, ?, ?)', values, function(err, result) {
        if (err) {
            done(err, undefined);
        } else {
            done(err, result.insertId);
        }
    })
}

module.exports = users;
