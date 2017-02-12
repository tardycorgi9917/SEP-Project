var express = require('express');
var teams = require('../models/teams.js');
var teamsvalidation = require('../validations/teams');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('this is the teams app');
});

router.post('/create-team', function(req, res, next) {
    var name = req.query.name;
    var scuntId = req.query.scuntId;
    var leaderId = req.query.leaderId;

    teamsvalidation.createTeamValidation(name, scuntId, leaderId, function(err) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        
        teams.create(name, scuntId, leaderId, function (err, id) {
            if (err) {
                res.status(500).send("An error occurred");
            } else {
                res.send(id.toString());
            }
        });
    })
});

module.exports = router;
