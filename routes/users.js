var express = require('express');
var router = express.Router();
var db = require('./../database/db.js')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('this is the users app');
});

router.post('/create-user', function(req, res, next) {
  exports.getAll = function(done) {
    db.get().query('SELECT * FROM users', function (err, rows) {
      if (err) return done(err)
      res.send(rows)
      done(null, rows)
    })
  }

 res.send("route working");

});

module.exports = router;
