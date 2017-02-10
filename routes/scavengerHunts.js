var express = require('express');
var scunt = require('../models/scavengerHunts');
var db = require('./../database/db.js')
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('this is the scunt app');
});

router.post('/create-ScavengerHunt', function(req, res, next) {
  scunt.create("frosh", "fresh meat", new Date(),new Date(), function(){});
  res.send("route working");
});

module.exports = router;