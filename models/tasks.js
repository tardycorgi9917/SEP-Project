var db = require("../database/db.js");
var async = require('async');

var tasks = {}

tasks.list = function(scuntId, done) {
	var query =
	'SELECT teamTaskRel.status, teamTaskRel.teamId, tasks.* '+
	'FROM tasks '+
	'JOIN teamTaskRel ON tasks.id = teamTaskRel.taskId '+
	'WHERE tasks.scuntId = ?'

	var values = [scuntId];
	
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
tasks.findsTeamTaskByuserandtask = function (uid, sid, done) {
    var query = 'SELECT  status FROM teamtaskrel tt JOIN teamuserrel tu on tt.teamId = tu.teamId JOIN teams t ON tt.teamId = t.id WHERE tu.userId = ?  AND t.scuntId = ?';
    var values = [uid, sid];
    db.get().query(query, values, function (err, result) {
        if (err) done(err);
        else done(null, result[0]);
    })
}

tasks.findsTeamTaskByuserandtask = function (uid, sid, done) {
    var query = 'SELECT  status FROM teamtaskrel tt JOIN teamuserrel tu on tt.teamId = tu.teamId JOIN teams t ON tt.teamId = t.id WHERE tu.userId = ?  AND t.scuntId = ?';
    var values = [uid, sid];
    db.get().query(query, values, function (err, result) {
        if (err) done(err);
        else done(null, result[0]);
    });
}

tasks.findsTeamTaskByuserandtask = function (uid, sid, done) {
    var query = 'SELECT  status FROM teamtaskrel tt JOIN teamuserrel tu on tt.teamId = tu.teamId JOIN teams t ON tt.teamId = t.id WHERE tu.userId = ?  AND t.scuntId = ?';
    var values = [uid, sid];
    db.get().query(query, values, function (err, result) {
        if (err) done(err);
        else done(null, result[0]);
    })
}

tasks.findsTeamTaskByuserandtask = function (uid, sid, done) {
    var query = 'SELECT  status FROM teamtaskrel tt JOIN teamuserrel tu on tt.teamId = tu.teamId JOIN teams t ON tt.teamId = t.id WHERE tu.userId = ?  AND t.scuntId = ?';
    var values = [uid, sid];
    db.get().query(query, values, function (err, result) {
        if (err) done(err);
        else done(null, result[0]);
    })
}

module.exports = tasks;
