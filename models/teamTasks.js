var db = require("../database/db.js");
var async = require('async');

var teamTasks = {}

teamTasks.create = function(teamId, taskId, status, scuntId, done) {
	var now = new Date().toISOString().slice(0, 19).replace('T', ' ');

	async.waterfall([
		function(callback) {
			// Create task entry
			var query = 'INSERT INTO teamtaskrel (teamId, taskId, status, createdAt, updatedAt) ';
			var values = [taskName, description, points, scuntId, now, now];
			db.get().query(query, values, function (err, result) {
				if (err) {
					callback(err);
				} else {
					var teamTaskaskId = result.insertId;
					callback(undefined, teamTaskaskId);
				}
			});
		}
	], function(err, teamTaskaskId) {
		done(err, teamTaskaskId);
	});
}

module.exports = teamTasks;