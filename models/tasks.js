var db = require("../database/db.js");
var async = require('async');

var tasks = {}

tasks.list = function(scuntId, done) {
	var query = 'SELECT t6.id, t6.name, t6.description, t6.points, t6.scuntId, '+
				't5.teamId, t5.taskId, t5.status, t6.createdAt AS created, t6.updatedAt AS updated ' +
				'FROM tasks t6 ' +
				'JOIN ('+
					'SELECT r1.teamId AS teamId, r1.taskId AS taskId, r1.status AS status '+
					'FROM teamTaskRel r1 '+
					'JOIN ('+
						'SELECT t1.id AS teamId, t2.id AS taskId '+
						'FROM teams t1 '+
						'JOIN tasks t2 '+
						'WHERE t1.scuntId = ? AND t2.scuntId = ?) t4 '+
					'ON t4.teamId = r1.teamId AND t4.taskId = r1.taskId) t5 '+
				'ON t6.id = t5.taskId'

	var values = [scuntId,scuntId];
	db.get().query(query, values, done);
}

tasks.create = function(taskName, description, points, scuntId, done) {

	async.waterfall([
		function(callback) {
			// Check if there is a task with the same name
			// might be unnecessary
			// TODO
			var query = 'SELECT COUNT(*) AS duplicateTask FROM tasks WHERE name = ? AND scuntId = ?';
			var values = [taskName, scuntId];

			db.get().query(query, values, function(err, result) {
				if (err) {
					callback(err);
				} else if (result[0].duplicateTask > 0) {
					callback('A task with this name already exists in this scavenger hunt');
				} else {
					callback(null);
				}
			});
		},
		function(callback) {
			// Create task entry
			var query = 'INSERT INTO tasks (name, description, points, scuntId, createdAt, updatedAt) '
						+ 'VALUES(?, ?, ?, ?, NOW(), NOW())';
			var values = [taskName, description, points, scuntId];
			db.get().query(query, values, function (err, result) {
				if (err) {
					callback(err);
				} else {
					var taskId = result.insertId;
					callback(undefined, taskId);
				}
			});
		}
	], function(err, taskId) {
		done(err, taskId);
	});
}

tasks.edit = function(taskId,editDict, done) {
	async.waterfall([
		function (callback) {
			if (!editDict["name"]) {
				return callback(null); // cannot be duplicate modif if name not changed
			}

			var query = 'SELECT COUNT(*) AS duplicateTasks'
				+ ' FROM tasks t1'
				+ ' JOIN tasks t2 ON t1.scuntId = t2.scuntId AND t1.id <> t2.id AND t1.id = ? AND t2.name = ?'

			var values = [taskId, editDict["name"]];

			db.get().query(query, values, function (err, result) {
				if (err) {
					callback(err);
				} else if (result[0].duplicateTasks > 0) {
					callback('A duplicate task exists');
				} else {
					callback(null);
				}
			});
		},
		function (callback) {
			// Create task entry
			var query = 'UPDATE tasks SET ';
			for (var field in editDict) {
				if (editDict.hasOwnProperty(field)) {
					query += field; // column name
					query += "= '" + editDict[field] + "'"; // column options
					query += ", ";
				}
			}

			query += " updatedAt = NOW() WHERE id = ?;"
			var values = [taskId];
			db.get().query(query,values, function (err) {
				if (err) {
					callback(err);
				} else {
					callback(undefined, taskId);
				}
			});
		}
	], function (err, taskId) {
		done(err, taskId);
	});
}

tasks.setTeamTaskStatus = function(taskId, teamId, status, done) {

	var validStatuses = ['INCOMPLETE', 'IN PROGRESS', 'REVIEW', 'APPROVED'];
	if (validStatuses.indexOf(status) == -1) {
		return done('An invalid status was used');
	}
	async.waterfall([
		function (callback) {
			var query = 'SELECT COUNT(*) AS duplicateTasks'
				+ ' FROM tasks t1'
				+ ' JOIN tasks t2 ON t1.scuntId = t2.scuntId AND t1.id <> t2.id AND t1.id = ? AND t2.id = ?'

			var values = [taskId, taskId];

			db.get().query(query, values, function (err, result) {
				if (err) {
					callback(err);
				} else if (result[0].duplicateTasks > 0) {
					callback('A duplicate task exists');
				} else {
					callback(null);
				}
			});
		},
		function(callback) {
			// Check if there is a task with the same name
			// might be unnecessary
			// TODO
			var query = 'SELECT COUNT(*) AS duplicateTask FROM teamTaskRel WHERE taskId = ? AND teamId = ?';
			var values = [taskId, teamId];

			db.get().query(query, values, function(err, result) {
				if (err) {
					callback(err);
				} else if (result[0].duplicateTask == 0) {
					callback('There is no relation between this task and team');
				}else {
					callback(null);
				}
			});
		},
		function (callback) {
			// Create task entry
			var query = "UPDATE teamTaskRel SET status = ? , updatedAt = NOW() WHERE teamId = ? AND taskId = ?;";
			var values = [status,teamId,taskId];
			db.get().query(query,values, function (err) {
				if (err) {
					callback(err);
				} else {
					callback(undefined, taskId,teamId);
				}
			});
		}
	], function (err, taskId,teamId) {
		done(err, taskId,teamId);
	});
}

tasks.approveTask = function(taskId, teamId, done) {
	async.waterfall([
		function (callback) {
			var query = 'SELECT COUNT(*) AS duplicateTasks'
				+ ' FROM tasks t1'
				+ ' JOIN tasks t2 ON t1.scuntId = t2.scuntId AND t1.id <> t2.id AND t1.id = ? AND t2.id = ?'

			var values = [taskId, taskId];

			db.get().query(query, values, function (err, result) {
				if (err) {
					callback(err);
				} else if (result[0].duplicateTasks > 0) {
					callback('A duplicate task exists');
				} else {
					callback(null);
				}
			});
		},
		function(callback) {
			// Check if there is a task with the same name
			// might be unnecessary
			// TODO
			var query = 'SELECT COUNT(*) AS duplicateTask FROM teamTaskRel WHERE taskId = ? AND teamId = ?';
			var values = [taskId, teamId];

			db.get().query(query, values, function(err, result) {
				if (err) {
					callback(err);
				} else if (result[0].duplicateTask == 0) {
					callback('There is no relation between this task and team');
				}else {
					callback(null);
				}
			});
		},
		function (callback) {
			// Create task entry
			var query = "UPDATE teamTaskRel SET status='APPROVED', updatedAt = NOW() WHERE teamId = ? AND taskId = ?;";
			var values = [teamId,taskId];
			db.get().query(query,values, function (err) {
				if (err) {
					callback(err);
				} else {
					callback(undefined, taskId,teamId);
				}
			});
		}
	], function (err, taskId,teamId) {
		done(err, taskId,teamId);
	});
}

tasks.delete = function (taskId, done) {
	var query = 'DELETE FROM tasks WHERE id = ?';
	values = [taskId];

	db.get().query(query, values, function (err, result) {
		done(err);
	});
}

tasks.getTaskStatus = function(teamId, taskId, done){
	var query = 'SELECT status FROM teamTaskRel WHERE taskId = ? AND teamId = ?';
	var values = [taskId, teamId];

	db.get().query(query, values, function(err, result){
		done(err, result);
	});
}

module.exports = tasks;
