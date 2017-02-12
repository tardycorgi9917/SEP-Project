var express = require('express');
var user = require('../models/users.js');
var db = require('./../database/db.js')
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('this is the users app');
});

router.post('/create-user', function(req, res, next) {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;

  user.create(firstName, lastName, email, function (err, id) {
    if (err) {
      res.status(500).send("An error occurred");
    } else {
      res.send(id.toString());
    }
  });
});

module.exports = router;
