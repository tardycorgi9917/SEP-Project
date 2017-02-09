var express = require('express');
var user = require('../models/users.js');
var db = require('./../database/db.js')
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('this is the users app');
});

router.post('/create-user', function(req, res, next) {
  user.create("thomas", "karatzas", "thomas.karatzas@mail.mcgill.ca", function(){});
  res.send("route working");
});

module.exports = router;
