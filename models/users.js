var db = require("../database/db.js");
var async = require('async');

var users = {}

users.login = function(username, password, done) {
    var query = 'SELECT id, username, firstName, lastName, email, phoneNumber, isPhoneNumberVisible FROM users WHERE username = ? AND password = ?';
    var values = [username.toString(), password.toString()];

    db.get().query(query, values, function(err, result) {
        if (err || result.length == 0) {
            done("Authorization failed: " + err);
        } else {
            done(null, result[0]);
        }
    });
}

users.create = function(username, firstName, lastName, email, password, phoneNumber, profilePicture, date, done) {
    if (!username) {
        return done('Need to provide a first name');
    }

    // Create user
    var query = 'INSERT INTO users (username, firstName, lastName, email, password, phoneNumber, profilePicture, createdAt, updatedAt) ' +
        'VALUES(?,?,?,?,?,?,?,?,?)';
        
    var values = [username, firstName, lastName, email, password, phoneNumber, profilePicture, date, date]
    db.get().query(query, values, function (err, result) {
        if (err) done(err, null);
        else done(null, result.insertId);
    });
}

users.update = function (email, fields, values, done) {
    if (!email) {
        return done("Need to provide a valid email address");
    }
    var n = fields.length;
    // TODO set a check for email
    var query = 'UPDATE users SET '
    for (var i = 0; i < n; i++) {
        query += fields[i] + ' = ? ';
        if (i != n - 1) query += ", "
    }
    query += 'WHERE email = ?';

    values.push(email);

    db.get().query(query, values, function (err, user) {
        if (err) done(err);
        else {
            done(null, user);
        }
    })
}

users.findByEmail = function (email, done) {
    var query = 'SELECT * FROM users WHERE email="' + email + '"';
    db.get().query(query, function (err, result) {
        if (err) done(err);
        else {
            done(null, result);
        }
    })
}

users.findById = function (id, done) {
    var query = 'SELECT * FROM users WHERE id = ?';
    var values = [id];
    db.get().query(query, values, function (err, result) {
        if (err) done(err);
        else done(null, result);
    })
}
module.exports = users;
