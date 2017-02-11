var express = require('express');
var teams = require('../models/teams.js');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('this is the teams app');
});

router.post('/create-team', function(req, res, next) {
    var name = req.query.name;
    var scuntId = req.query.scuntId;

    teams.create(name, scuntId);

    res.send("route working");
});

module.exports = router;
