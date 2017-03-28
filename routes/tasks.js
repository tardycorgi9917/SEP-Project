var express = require('express');
var tasks = require('../models/tasks.js');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('this is the tasks app');
});

router.get('/task-list', function(req, res, next) {
	var scuntId = req.query.scuntId;

	tasks.list(scuntId, function(err, tasks) {
		if (err) {
			res.status(500).send(err);
		} else {
			res.send(tasks);
		}
	});
});

router.get('/admin-task-list', function(req, res, next){
    var scuntId = req.query.scuntId;
    var isAdmin = req.query.isAdmin;
    tasks.admin_list(scuntId, isAdmin, function(err, tasks){
        if (err) {
			res.status(500).send(err);
		} else {
			res.send(tasks);
		}
    });
});

router.get('/team-task-list', function(req, res, next){
    var scuntId = req.query.scuntId;
    var userId = req.query.userId;
    tasks.team_list(scuntId, userId, function(err, tasks){
        if(err){
            res.status(500).send(err);
        } else{
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
	});
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
	});
});

router.post('/approve-task', function(req, res, next) {
	var taskId = req.body.taskId;
	var teamId = req.body.teamId;
	if(taskId == null){
		res.sendStatus(500);
	}
	if(teamId == null){
		res.sendStatus(500);
	}


	tasks.approveTask(taskId, teamId, function (err, taskId,teamId) {
		if (err) {
			res.status(500).send(err);
		} else {
			res.send(taskId.toString());
		}
	});
});

router.post('/reject-task', function(req, res, next) {
	var taskId = req.body.taskId;
	var teamId = req.body.teamId;
	if(taskId == null){
		res.sendStatus(500);
	}
	if(teamId == null){
		res.sendStatus(500);
	}


	tasks.rejectTask(taskId, teamId, function (err, taskId,teamId) {
		if (err) {
			res.status(500).send(err);
		} else {
			res.send(taskId.toString());
		}
	});
});

router.post('/submit-task', function(req, res, next) {
	var taskId = req.body.taskId;
	var teamId = req.body.teamId;
	if(taskId == null){
		res.sendStatus(500);
	}
	if(teamId == null){
		res.sendStatus(500);
	}


	tasks.submitTask(taskId, teamId, function (err, taskId,teamId) {
		if (err) {
			res.status(500).send(err);
		} else {
			res.send(taskId.toString());
		}
	});
});

router.delete('/delete-task/', function(req, res, next) {
	var taskId = req.query.taskId;
	if(taskId == null){
		res.sendStatus(500);
	}

	tasks.delete(taskId, function(err) {
		if (err) {
			res.sendStatus(500);
		} else {
			res.sendStatus(200);
		}
	});
});

router.get('/get-task-status/', function(req, res, next){
    var teamId = req.query.teamId;
    var taskId = req.query.taskId;

    tasks.getTaskStatus(taskId, teamId, function(err, result){
        if(err) {
            res.sendStatus(500);
        } else {
            res.send(result);
        }
    })
});

router.post('/change-task-status/', function(req, res, next){
    var teamId = req.body.teamId;
    var taskId = req.body.taskId;
    var status = req.body.status;

    tasks.setTeamTaskStatus(taskId, teamId, status, function(err, result){
        if(err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

router.post('/add-comment', function(req, res, next) {
    var taskId = req.body.taskId;
    var userId = req.body.userId;
	var comment = req.body.comment;

	tasks.addComment(taskId, userId, comment, function(err, result) {
		if (err) {
			res.sendStatus(500);
		} else {
			res.sendStatus(200);
		}
	});
});

module.exports = router;
