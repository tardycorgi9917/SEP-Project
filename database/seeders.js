var schema = require('./schema');
var db = require('./db');
var seed = {};

seed.up = function(done) {
  for (var table in schema) {
    if (schema.hasOwnProperty(table)) {
      var qstr = "CREATE TABLE IF NOT EXISTS `" + schema[table].name  + "` (";
      for(var field in schema[table].fields){
        if (schema[table].fields.hasOwnProperty(field)) {
           qstr += "`" + field + "` "; // column name
           qstr += schema[table].fields[field]; // column options
           qstr += ", ";
        }
      }

      qstr = qstr.slice(0, -2); // remove last comma
      qstr += ");";

      db.get().query(qstr, [], function(err, result) {
        var i = 0;
        if(err){
          console.log("it fucked up " + err);
        } else {
          console.log("Table " + schema[table].name +" created Succesfully");
        }
        done();
      })
    }
  }
}

seed.down = function(done){
  for (var table in schema) {
    if (schema.hasOwnProperty(table)) {
      var query = "DROP TABLE `" + schema[table].name + "`;";
      db.get().query(query, [], function(err, result) {
        if(err){
          console.log("it fucked up " + err);
        } else {
          console.log("Table " + schema[table].name +" Removed Succesfully");
        }
         done();
      })
    }
  }
}

module.exports = seed;