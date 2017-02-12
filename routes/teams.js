var express = require('express');
var teams = require('../models/teams.js');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('this is the teams app');
});

router.post('/create-team', function(req, res, next) {
    var name = req.body.name;
    var scuntId = req.body.scuntId;
    var leaderId = req.body.leaderId;

    teams.create(name, scuntId, leaderId, function (err, id) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(id.toString());
        }
    })
});

router.delete('/delete-team', function(req, res, next) {
    var teamId = req.body.teamId;

    teams.delete(teamId, function(err) {
        if (err) {
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

router.post('/add-to-team', function(req, res, next) {
    var userId = req.body.userId;
    var teamId = req.body.teamId;

    teams.join(userId, teamId, false, function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.sendStatus(200);
        }
    });
});

router.post('/join-team', function(req, res, next) {
    var userId = req.body.userId;
    var teamId = req.body.teamId;

    teams.join(userId, teamId, true, function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.sendStatus(200);
        }
    });
});

module.exports = router;
