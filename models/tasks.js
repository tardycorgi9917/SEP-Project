var db = require("../database/db.js");
var async = require('async');
var teams = require('./teams');
var tasks = {}

tasks.admin_list = function(scuntId, isAdmin, done){
	if(isAdmin){
		var query = `
			SELECT *
			FROM tasks
			WHERE scuntId = ?
		`;
		var values = [scuntId]
		db.get().query(query, values, done);
	} else {
		return done('Unauthorized operation for non-admin');
	}
}

tasks.team_list = function(scuntId, userId, done){
	async.waterfall([
		function(callback){
			teams.getTeamId(userId, function(err, teamId){
				if(err) callback(err)
				else callback(null, teamId)
			});
		}, function(teamId, callback){
			var query = `
				SELECT teamTaskRel.status, teamTaskRel.teamId, tasks.*
				FROM tasks
				JOIN teamTaskRel ON tasks.id = teamTaskRel.taskId
				WHERE tasks.scuntId = ? AND teamTaskRel.teamId = ?
			`
			var values = [scuntId, teamId];
			db.get().query(query, values, function(err, result){
				callback(err, result);
			});

		}
	], function(err, result){
		done(err, result)
	});
}

tasks.list = function (scuntId, done) {
	async.waterfall([
		function (callback) {
			var query = 'SELECT status FROM scunt WHERE id = ?';
			var values = [scuntId];

			db.get().query(query, values, function (err, res) {
				if (res && res[0]) {
					callback(err, res[0].status);
				} else {
					callback("The scavenger hunt was not found");
				}
			});
		}, function (status, callback) {
			if (status == 'STARTED' || status == 'FINISHED') {
				var query = `
				SELECT teamTaskRel.status, teams.id as teamId, teams.name as teamName, tasks.*
				FROM tasks
				JOIN teamTaskRel ON tasks.id = teamTaskRel.taskId
				JOIN teams ON teamTaskRel.teamId = teams.id
				WHERE tasks.scuntId = ?
				ORDER BY teamId, tasks.name, teamTaskRel.status
				`;
			} else {
				var query = "SELECT 'PENDING' AS status, -1 AS teamId, '' AS teamName, tasks.* FROM tasks WHERE tasks.scuntId = ?";
			}

			var values = [scuntId];
			db.get().query(query, values, callback);
		}
	], function (err, result) {
		done(err, result)
	});
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
						+ 'VALUES(?, ?, ?, ?, ?, ?)';

			var now = new Date();	
			var values = [taskName, description, points, scuntId, now, now];
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

			var query = 'SELECT COUNT(*) AS numTasks'
				+ ' FROM tasks'
				+ ' WHERE id = ?';

			var values = [taskId];

			db.get().query(query, values, function (err, result) {
				if (err) {
					callback(err);
				} else if (result[0].numTasks == 0) {
					callback('There is no task with this id');
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

			query += " updatedAt = ? WHERE id = ?;"
			
			var values = [new Date(), taskId];
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

	// var validStatuses = ['INCOMPLETE', 'IN PROGRESS', 'REVIEW', 'APPROVED'];
	var validStatuses = ['PENDING', 'SUBMITTED', 'COMPLETED', 'INCOMPLETE'];
	var validStatusesNew = [
		{
			'status':'PENDING',
			'prevStatus':['NEW','SUBMITTED']
		},
		{
			'status':'SUBMITTED',
			'prevStatus':['PENDING']
		},
		{
			'status':'COMPLETED',
			'prevStatus':['SUBMITTED']
		},
		{
			'status':'INCOMPLETE',
			'prevStatus':['PENDING']
		}
	];
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
		function (callback) {
			tasks.getTaskStatus(taskId,teamId, function(err, result){
				if(err) {
					callback(err);
				} else {
					callback(null,result);
				}
			});
		},
		function(curStatus,callback){
			for(var i in validStatusesNew){
				if(validStatusesNew[i].status == status){
					if (validStatusesNew[i].prevStatus.indexOf(curStatus) == -1) {
						callback('The status transition is not allowed according to the set up lifecycle');
					}else{
						callback(null);
					}
				}
			}

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
			var query = "UPDATE teamTaskRel SET status = ? , updatedAt = ? WHERE teamId = ? AND taskId = ?;";
			var values = [status, new Date(), teamId,taskId];
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
			tasks.setTeamTaskStatus(taskId,teamId, 'COMPLETED', function(err, result){
				if(err) {
					callback(err);
				} else {
					callback(undefined);
				}
			});
		},
		function(callback) {
			var query = "SELECT points FROM tasks WHERE id = ?";
			var values = [taskId];

			db.get().query(query, values, function(err, res) {
				if (err) {
					callback(err);
				} else if (!res || !res[0]) {
					callback("Could not find points for task");
				} else {
					callback(null, res[0].points);
				}
			})
		},
		function(points, callback) {
			var query = "UPDATE teams SET points = points + ? WHERE id = ?";
			var values = [points, teamId];
			db.get().query(query, values, function(err) {
				if (err) {
					callback(err);
				} else {
					callback(null);
				}
			})
		}
	], function (err) {
		done(err, taskId, teamId);
	});
}

tasks.rejectTask = function(taskId, teamId, done) {
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
			tasks.setTeamTaskStatus(taskId,teamId, 'PENDING', function(err, result){
				if(err) {
					callback(err);
				} else {
					callback(undefined);
				}
			});
		}
	], function (err) {
		done(err, taskId, teamId);
	});
}

tasks.submitTask = function(taskId, teamId, done) {
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
			tasks.setTeamTaskStatus(taskId,teamId, 'SUBMITTED', function(err, result){
				if(err) {
					callback(err);
				} else {
					callback(undefined);
				}
			});
		}
	], function (err) {
		done(err, taskId, teamId);
	});
}

tasks.delete = function (taskId, done) {


	async.waterfall([
		function (callback) {

			var query = 'SELECT COUNT(*) AS duplicateTasks'
				+ ' FROM tasks t1'
				+ ' JOIN tasks t2 ON t1.scuntId = t2.scuntId AND t1.id <> t2.id AND t1.id = ?'

			var values = [taskId];

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

			var query = 'SELECT COUNT(*) AS numTasks'
				+ ' FROM tasks'
				+ ' WHERE id = ?'

			var values = [taskId];

			db.get().query(query, values, function (err, result) {
				if (err) {
					callback(err);
				} else if (result[0].numTasks == 0) {
					callback('There is no task with this id');
				} else {
					callback(null);
				}
			});
		},
		function (callback) {
			// Create task entry
			var query = 'DELETE FROM tasks WHERE id = ?';
			values = [taskId];
			db.get().query(query,values, function (err) {
				if (err) {
					callback(err);
				} else {
					callback(undefined, taskId);
				}
			});
		}
	], function (err) {
		done(err);
	});
}

tasks.getTaskStatus = function(taskId,teamId, done){
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
			var query = 'SELECT COUNT(*) AS numTask FROM teamTaskRel WHERE taskId = ? AND teamId = ?';
			var values = [taskId, teamId];

			db.get().query(query, values, function(err, result) {
				if (err) {
					callback(err);
				} else if (result[0].numTask == 0) {
					callback('There is no relation between this task and team');
				}else {
					callback(null);
				}
			});
		},
		function (callback) {
			var query = 'SELECT status FROM teamTaskRel WHERE taskId = ? AND teamId = ?';
			var values = [taskId, teamId];

			db.get().query(query, values, function(err, result){
				done(err, result[0].status);
			});
		}
	], function (err) {
		done(err, taskId, teamId);
	});

}

tasks.addComment = function(taskId, userId, comment, done) {
	var query = 'INSERT INTO comments (taskId, userId, comment, createdAt) VALUES (?, ?, ?, ?)';
	var values = [taskId, userId, comment, new Date()];

	db.get().query(query, values, function(err, result) {
		if (err) {
			done(err);
		} else {
			var commentId = result.insertId;
			done(undefined, taskId);
		}
	});
}

tasks.listComment = function(taskId, done) {
	var query = 'SELECT * FROM comments WHERE taskId = ?';
	var values = [taskId];

	db.get().query(query, values, function(err, result) {
		if (err) {
			done(err);
		} else {
			done(err,result);
		}
	});
}

module.exports = tasks;
