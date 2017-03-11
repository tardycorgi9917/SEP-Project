var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var seeders = require('./database/seeders');
var args = process.argv.slice(2);

// add database setup module
var db = require('./database/db.js')
var seed = require('./database/seeders.js');

// Connect to database on start
db.connect(db, function(err) {
  if (err) {
    console.log('Unable to connect to MySQL.')
    process.exit(1)
  } else {
    console.log("DB CONNECTED");
    if (process.env.NODE_ENV === "production") {
      console.log("***********************************************************")
      console.log("WARNING: YOU ARE IN PRODUCTION MODE! ALL CHANGES WILL AFFECT PRODUCTION DATABASE")
      seeders.down(function () {
        seeders.up(function(){
          console.log("Seeders completed");
        });
      });
      console.log("***********************************************************")
    }
  }
})

if (args.length && args[0] == "DB=up") {
  // if(true){
  console.log("****************************BEGINNING MIGRATION********************************");
  seed.up(function () {
    console.log("****************************FINISHED MIGRATION********************************");
    process.exit(0);
  });
}
else if (args.length && args[0] == "DB=down") {
  console.log("****************************DROPPING ALL TABLES********************************");
  seed.down(function () {
    console.log("****************************FINISHED DROPPING TABLES********************************");
    process.exit(0);
  });
}
else if(args.length && args[0] == "seed" && args[1] == "clean"){
  console.log("****************************Cleaning and Seeding********************************");
  seed.down(function() {
   seed.up(function() {
     seed.populate(function(){
       console.log("****************************FINISHED POPULATING TABLES********************************");
       process.exit(0);
     })
   })
  });
}
else if(args.length && args[0] == "seed"){
  console.log("****************************POPULATING ALL TABLES********************************");
  seed.populate(function () {
    console.log("****************************FINISHED POPULATING TABLES********************************");
    process.exit(0);
  });
}

var index = require('./routes/index');
var users = require('./routes/users');
var teams = require('./routes/teams');
var tasks = require('./routes/tasks');
var scavengerHunts = require('./routes/scavengerHunts');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/teams', teams);
app.use('/tasks', tasks);
app.use('/scavengerHunts', scavengerHunts)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
