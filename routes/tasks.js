var express = require('express');
var tasks = require('../models/tasks.js');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('this is the tasks app');
});

router.get('/list-tasks', function(req, res, next) {
	var scuntId = req.query.scuntId;
	
	tasks.list(scuntId, function(err, tasks) {
		if (err) {
			res.status(500).send(err);
		} else {
			res.send(tasks);
		}
	});
})

router.post('/create-task', function(req, res, next) {
	var taskName = req.body.taskName;
	var description = req.body.description;
	var points = req.body.points;
	var scuntId = req.body.scuntId;
	if(points == null) points = 0;

	tasks.create(taskName, description, points, scuntId, function (err, id) {
		if (err) {
			res.status(500).send(err);
		} else {
			res.send(id.toString());
		}
	})
});

router.post('/edit-task', function(req, res, next) {
	var taskID = req.body.taskID;
	var taskName = req.body.taskName;
	var description = req.body.description;
	var points = req.body.points;
	var scuntId = req.body.scuntId;
	var taskDict = {};
	if(taskName != null) taskDict["name"] = taskName;
	if(description != null) taskDict["description"] = description;
	if(points != null) taskDict["points"] = points;
	if(scuntId != null) taskDict["scuntId"] = scuntId;

	tasks.edit(taskID, taskDict, function (err, id) {
		if (err) {
			res.status(500).send(err);
		} else {
			res.send(id.toString());
		}
	})
});

router.post('/approve-task', function(req, res, next) {
	var taskId = req.body.taskId;
	var teamId = req.body.teamId;
	if(taskId != null){
		taskDict["taskId"] = taskId;
	}else{
		res.status(500).send(err);
	}
	if(teamId != null){
		taskDict["teamId"] = teamId;
	}else{
		res.status(500).send(err);
	}


	tasks.approveTask(taskId, teamId, function (err, taskId,teamId) {
		if (err) {
			res.status(500).send(err);
		} else {
			res.send(taskId.toString());
		}
	})
});

router.delete('/delete-task/', function(req, res, next) {
	var taskId = req.query.taskId;

	tasks.delete(taskId, function(err) {
		if (err) {
			res.sendStatus(500);
		} else {
			res.sendStatus(200);
		}
	});
});

module.exports = router;
