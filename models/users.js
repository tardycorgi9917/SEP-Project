var db = require("../database/db.js");

var users = {}

users.create = function(firstname, lastname, email, done) {
    var values = [firstname, lastname, email, new Date().toISOString()]

    db.get().query('INSERT INTO users (firstname, lastname, email, created) VALUES(?, ?, ?)', values, function(err, result) {
        if (err) return done(err)
        done(null, result.insertId)
    })
}

module.exports = users;
