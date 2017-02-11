var schema = require('./schema');
var db = require('./db');
async = require('async');
var seed = {};

seed.up = function(done) {
	var tables = Object.keys(schema);
	var qstr = "";
	async.each(tables, function(table) {
		if (schema.hasOwnProperty(table)) {
			qstr += "CREATE TABLE IF NOT EXISTS `" + schema[table].name  + "` (";

			for(var field in schema[table].fields){
				if (schema[table].fields.hasOwnProperty(field)) {
					 qstr += "`" + field + "` "; // column name
					 qstr += schema[table].fields[field]; // column options
					 qstr += ", ";
				}
			}
			
			for(var constraint in schema[table].constraints){
				qstr += schema[table].constraints[constraint]; // constraint
				qstr += ", ";
			}
			
			qstr = qstr.slice(0, -2); // remove last comma
			qstr += ");";
		}
	}, done);
	console.log("****** query to create tables: " + qstr);

	db.get().query(qstr, [], function(err, result) { //query for table structure
		var i = 0;
		if(err){
			console.log("****** it fucked up " + err);
			console.log("****** it fucked up with " + qstr);
		} else {
			console.log("---- Table created Succesfully ----");
		}
		done();
	});
}

seed.down = function(done){
	var tables = Object.keys(schema);
	tables.reverse();
	var query = "";
	async.each(tables, function(table) {
		if (schema.hasOwnProperty(table)) {
			query += "DROP TABLE IF EXISTS `" + schema[table].name + "`; ";
		}
	}, function(){
		done();
	});
	console.log("****** query to drop tables: " + query);

	var dbpool = db.get();
	if (dbpool)	{
		dbpool.query(query, [], function (err, result) {
			if (err) {
				console.log("it fucked up " + err);
				console.log("it fucked up with " + query);
			} else {
				console.log("---- Tables Removed Succesfully ----");
			}
			done();
		});
	}
}

module.exports = seed;