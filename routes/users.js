var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('this is the users app');
});

router.post('/create-user', function(req, res, next) {
  res.send('user succesfully created');
});
module.exports = router;
