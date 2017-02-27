var express = require('express');
var user = require('../models/users.js');
var db = require('./../database/db.js')
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('this is the users app');
});

router.post('/login', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  user.login(username, password, function(err, user) {
      if (err) {
          res.sendStatus(403);
      } else {
          res.send(JSON.stringify(user));
      }
  });
});

router.post('/create-user', function(req, res, next) {
  var username = req.body.username;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;
  var password = req.body.password;
  var phoneNumber = req.body.phoneNumber || "";
  var isAdmin = req.body.isAdmin == "true";
  var profilePicture = "";
  
  console.log(req.body);
  var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
  user.create(
      username,
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      isAdmin,
      profilePicture,
      date,
      function(err, result){
          if(err){
              console.log(err);
              res.status(500).send(err);
          }
          else {
              res.send(result.toString());
          }
      });
});

router.post('/update-user', function(req, res, next){
    var email = req.body.email;
    var fields = req.body.fields;
    var values = req.body.values;
    user.update(email, fields, values, function(err, result){
        if(err) {
            res.status(500).send(err);
        } else {
            console.log("Updated User Successfully");
            res.send(result);
        }
    });
});

router.get('/find-email/:email', function(req, res){
    var email = req.params.email;
    user.findByEmail(email, function(err, result){
        if(err) res.status(500).send(err);
        else res.send(result);
    })
});

router.get('/find-id/:id', function(req, res){
    var id = req.params.id;
    user.findById(id, function(err, result){
        if(err) res.status(500).send(err);
        else res.send(result[0]);
    })
})

router.get('/find-username/:username', function(req, res){
    var username = req.params.username;
    user.findByUsername(username, function(err, result){
        if(err) res.status(500).send(err);
        else res.send(result);
    })
})
module.exports = router;
