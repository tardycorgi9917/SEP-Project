var db = require("../database/db.js");

var users = {}

users.create = function(firstName, lastName, email, password, phoneNumber, profilePicture, date, done) {
    if (!firstName) {
        return done('Need to provide a first name');
    }
    
    var query = 'INSERT INTO users (firstName, lastName, email, password, phoneNumber, profilePicture, createdAt, updatedAt) '+
        'VALUES(?,?,?,?,?,?,?,?)';
    var values = [firstName, lastName, email, password, phoneNumber, profilePicture, date, date]
    db.get().query(query, values, function(err, result){
        if(err) done(err);
        else done(null, result.insertId);
    });
}

users.update = function(email, fields, values, done){
    if (!email) {
        return done("Need to provide a valid email address");
    }
    var n = fields.length;
    // TODO set a check for email
    var query = 'UPDATE users SET '
    for (var i = 0; i < n; i++){
        query += fields[i] + ' = ? ';
        if(i != n-1) query += ", "
    }
    query += 'WHERE email = ?';

    values.push(email);

    db.get().query(query, values, function(err, user){
        if(err) done(err);
        else{
            done(null, user);
        }
    })
}

users.findByEmail = function(email, done){
    var query = 'SELECT * FROM users WHERE email="' + email + '"';
    db.get().query(query, function(err, result){
        if(err) done(err);
        else{
            done(null, result);
        }
    })
}

users.findById = function(id, done){
    var query = 'SELECT * FROM users WHERE id = ?';
    var values = [id];
    db.get().query(query, values, function(err, result){
        if(err) done(err);
        else done(null, result);
    })
}
module.exports = users;
