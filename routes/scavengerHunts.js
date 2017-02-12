var express = require('express');
var scunt = require('../models/scavengerHunts');
var db = require('./../database/db.js')
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('this is the scunt app');
});

router.post('/create-ScavengerHunt', function(req, res, next) {
    var ScuntName = req.body.name;
    var ScuntDesc = req.body.description;
    var ScuntStart = new Date(Date.parse(req.body.startTime));
    var ScuntEnd  = new Date(Date.parse(req.body.endTime));

  scunt.create(ScuntName, ScuntDesc, ScuntStart,ScuntEnd, function(err, id){
    if(err)
    {
      res.status(500).send("An error occurred");
    }else{
      res.send(id.toString());
    }
   });
});


router.put('/modify-ScavengerHunt', function(req,res,next){
    var id = req.body.id;
    var newScuntName = req.body.name;
    var newScuntDesc = req.body.description;
    var newScuntStart = new Date(Date.parse(req.body.startTime));
    var newScuntEnd = new Date(Date.parse(req.body.endTime));


    scunt.update(id,newScuntName, newScuntDesc, newScuntStart,newScuntEnd, function(err, result){
    if(err)
    {
      res.status(500).send("An error occurred");
    }else{
      res.sendStatus(200);
    }
   });


});


module.exports = router;