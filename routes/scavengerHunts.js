var express = require('express');
var scunt = require('../models/scavengerHunts');
var db = require('./../database/db.js')
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('this is the scunt app');
});

router.get('/list-scunts', function (req, res) {
  scunt.list(function (err, result) {
    if (err) {
      res.sendStatus(500);
    } else {
      res.send(JSON.stringify(result));
    }
  })
});

router.get('/view-scuntStatus/:ScuntId', function(req,res){
  var ScuntId = req.params.ScuntId;
  scunt.getStatus(ScuntId,function(err,result){
    if(err)
    {
      res.sendStatus(500);
    }else
    {
      res.send(JSON.stringify(result));
    }
  })
});

router.post('/create-ScavengerHunt', function (req, res, next) {
  var ScuntName = req.body.name;
  var ScuntDesc = req.body.description;
  var StartDate = req.body.startTime.replace(", ", " ");
  var EndDate = req.body.endTime.replace(", ", " ");
  var ScuntStart = new Date(Date.parse(StartDate));
  var ScuntEnd = new Date(Date.parse(EndDate));
  var now = new Date();
  if(ScuntEnd.getTime() < ScuntStart.getTime()) res.status(500).send('Dates are inverted')
  else if (ScuntEnd.getTime() < now.getTime()) res.status(500).send("Can't finish before today");
  else {
      scunt.create(ScuntName, ScuntDesc, ScuntStart, ScuntEnd, function (err, id) {
        if (err) {
          res.status(500).send(err);
        } else {
          res.send(id.toString());
        }
      });
  }
});

router.put('/start-scunt', function(req, res, next) {
  var id = req.body.id;

  scunt.start(id, function (err, result) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(200);
    }
  });
});

router.put('/close-scunt', function (req, res, next) {
  var scuntId = req.body.scuntId;
  if(scuntId == null){
    res.sendStatus(500);
  }
  scunt.close(scuntId, function (err, scuntId) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(200).send(scuntId.toString());
    }
  });
});

router.put('/status-scunt', function (req, res, next) {
  var id = req.body.id;
  var status = req.body.status;

  scunt.setStatus(id, status, function (err, result) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(200);
    }
  });
});


router.put('/time-scunt', function (req, res, next) {
  var id = req.body.id;

  scunt.getTimeRemaining(id, function (err, result) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(200);
    }
  });
});
  
router.get('/find-id/:id', function(req, res){
    var id = req.params.id;
    scunt.findById(id, function(err, result){
        if(err) res.status(500).send(err);
        else res.send(result[0]);
    })

});

router.put('/modify-ScavengerHunt', function (req, res, next) {
  var id = req.body.id;
  var newScuntName = req.body.name;
  var newScuntDesc = req.body.description;
  var newScuntStart = new Date(Date.parse(req.body.startTime));
  var newScuntEnd = new Date(Date.parse(req.body.endTime));

  scunt.update(id, newScuntName, newScuntDesc, newScuntStart, newScuntEnd, function (err, result) {
    if (err) {
      res.status(500).send("An error occurred");
    } else {
      res.sendStatus(200);
    }
  });
});

router.delete('/delete-ScavengerHunt/:scuntId', function (req, res, next) {
  var scuntId = req.params.scuntId;

  scunt.delete(scuntId, function (err, result) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(200);
    }
  });
});

module.exports = router;
