var db = require("../database/db.js");

var scunt = {}

scunt.create = function(name, description, startTime, endTime) {
    var values = [name, description, startTime,endTime, new Date().toISOString().slice(0, 19).replace('T', ' '),new Date().toISOString().slice(0, 19).replace('T', ' ')];

    db.get().query('INSERT INTO scunt (name, description, startTime,endTime, createdAt, updatedAt) VALUES(?, ?, ?, ?, ?, ?)', values, function(err, result) {
        if (err) {
            console.log(err)
        }
    })
}

scunt.update = function(id , name, description, startTime, endTime){
    


}

module.exports = scavengerHunts;