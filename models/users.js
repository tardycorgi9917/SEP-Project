var db = require("../database/db.js");

var users = {}

users.create = function(firstName, lastName, email, password, phoneNumber, profilePicture, date, done) {
    var query = 'INSERT INTO users (firstName, lastName, email, password, phoneNumber, profilePicture, createdAt, updatedAt) VALUES(?,?,?,?,?,?,?,?)';
    var values = [firstName, lastName, email, password, phoneNumber, profilePicture, date, date]
    db.get().query(query, values, function(err, result){
        if(err){
            done(err);
        }
        else {
            console.log("User Created Successfully")
            done(null, result.insertId);
        }
    });
}

module.exports = users;
