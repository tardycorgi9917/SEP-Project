var express = require('express');
var teams = require('../models/teams.js');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('this is the teams app');
});

router.get('/list-teams', function(req, res, next) {
    teams.list(function(err, teams) {
        if (err) {
            res.status(500).send(err);
            console.log(err);
        } else {
            res.send(teams);
        }
    });
});

router.post('/create-team', function(req, res, next) {
    var name = req.body.name;
    var points = req.body.points;
    var maxmembers = req.body.maxmembers;
    var scuntId = req.body.scuntId;
    var leaderId = req.body.leaderId;

    teams.create(name, points, maxmembers, scuntId, leaderId, function (err, id) {
        if (err) {
            res.status(500).send(err);
            console.log(err);
        } else {
            res.send(id.toString());
        }
    })
});

router.delete('/delete-team/:teamId', function(req, res, next) {
    var teamId = req.params.teamId;

    teams.delete(teamId, function(err) {
        if (err) {
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

router.post('/add-to-team/', function(req, res, next) {
    var username = req.body.username;
    var teamId = req.body.teamId;

    teams.join(username, teamId, false, function(err, userId) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(userId.toString());
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

router.delete('/remove-from-team/:teamId/:userId', function(req, res, next) {
    var userId = req.params.userId;
    var teamId = req.params.teamId;

    teams.removeTeamUserRel(teamId, userId, function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.sendStatus(200);
        }
    })
});

router.post('/update-team', function(req, res, next){
    var teamId = req.body.teamId;
    var name = req.body.name;
    var points = req.body.points;
    var maxmembers = req.body.maxmembers;
    var scuntId = req.body.scuntId;

    teams.update(teamId, name, points, maxmembers, scuntId, function(err){
        if(err){
            res.status(500).send(err);
        } else {
            res.sendStatus(200);
        }
    });
});

router.get('/team-points/:teamId', function (req, res, next) {
  var teamId = req.params.teamId;

  teams.getPoints(teamId, function (err, result) {
    if (err) {
      res.status(500).send(err);
    } else {
      // res.sendStatus(200);
      res.send(result);
    }
  });
});

router.get('/points', function(req, res, next){
    var scuntId = req.query.scuntId;
    teams.getScuntTeams(scuntId, function(err, result){
        if (err) {
          res.status(500).send(err);
        } else {
          res.send(result);
        }
    })
});

module.exports = router;
