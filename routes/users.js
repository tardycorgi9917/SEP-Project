var express = require('express');
var user = require('../models/users.js');
var db = require('./../database/db.js')
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('this is the users app');
});

router.post('/create-user', function(req, res, next) {
  var firstName = req.query.firstName;
  var lastName = req.query.lastName;
  var email = req.query.email;

  user.create(firstName, lastName, email, function (err, id) {
    if (err) {
      res.status(500).send("An error occurred");
    } else {
      res.send(id.toString());
    }
  });
});

module.exports = router;
