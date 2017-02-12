var db = require("../database/db.js");

var users = {}

users.create = function(firstName, lastName, email, password, phoneNumber, profilePicture, date, done) {
    var query = 'INSERT INTO users (firstName, lastName, email, password, phoneNumber, profilePicture, createdAt, updatedAt) VALUES(?,?,?,?,?,?,?,?)';
    var values = [firstName, lastName, email, password, phoneNumber, profilePicture, date, date]
    db.get().query(query, values, done);
}

module.exports = users;
