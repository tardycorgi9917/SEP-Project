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
  var password = req.body.password;
  var phoneNumber = req.body.phoneNumber || "";
  var profilePicture = "";
  var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
  user.create(
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      profilePicture,
      date,
      function(err, result){
          if(err){
              console.log(err);
              res.status(500).send(err);
          }
          else {
              console.log("User Created Successfully")
              res.send(result.toString());
          }
      });
});

module.exports = router;
