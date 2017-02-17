var db = require("../database/db.js");
var async = require('async');
var scunt = {}

scunt.createScunt = function(name, description, startTime, endTime, done) {


    var date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    var values = [name, description,startTime ,endTime, date, date];
    var query = 'INSERT INTO scunt (name, description, startTime, endTime, createdAt, updatedAt) VALUES(?, ?, ?, ?, ?, ?)';

    db.get().query(query, values, function(err, result) {
        if (err) {
            done(err, undefined);
        } else {
            done(undefined, result.insertId);
        }
    })
}

scunt.create = function(name,description, startTime, endTime, done){


    async.waterfall([
        //checks if scunt already exist
        function(callback){
            var query = 'SELECT COUNT(*) AS duplicateScunt FROM scunt where name =?';
            var values = [name];
            db.get().query(query , values, function(err,result){
                if(err){
                    callback(err);
                }else if(result[0].duplicateScunt > 0 )
                {
                    callback('Scunt with same name already exist ')
                }else{
                    callback(null);
                }

            });

        },
        function(callback){

            var sTime = startTime.toISOString().slice(0, 19).replace('T', ' ');
            var eTime = endTime.toISOString().slice(0, 19).replace('T', ' ');
            scunt.createScunt(name,description, sTime, eTime , done);
        }

    ],function(err, scuntId){

        done(err,scuntId);

    });



}


scunt.update = function(id , name, description, startTime, endTime, done){

    var sTime = startTime.toISOString().slice(0, 19).replace('T', ' ');
    var eTime = endTime.toISOString().slice(0, 19).replace('T', ' ');
    var UpdatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

    var values = [name, description, sTime,eTime, UpdatedAt, id];
    var query = 'UPDATE scunt SET name = ?, description = ? , startTime = ?, endTime = ?, updatedAt = ? WHERE id = ?'
    
    db.get().query(query, values, function(err, result) {
        if (err) {
            done(err, undefined);
        }else{
            done(undefined, result);
        }
    })

}

module.exports = scunt;