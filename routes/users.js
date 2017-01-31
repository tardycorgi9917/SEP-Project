var express = require('express');
var router = express.Router();
var mysql = require('mysql')

var connection = mysql.createConnection({
  host: 'localhost',
  database: 'sep_db',
  user: 'root',
  password: 'root'
})

/* GET users listing. */
router.get('/', function(req, res, next) {
  
  res.send('this is the users app');
});

router.post('/create-user', function(req, res, next) {
 connection.connect();

 connection.query('SELECT * from users', function (error, results, fields) {
    if (error) throw error;
    res.send('The solution is: ', results[0]);
  });

  connection.end();

});

module.exports = router;
