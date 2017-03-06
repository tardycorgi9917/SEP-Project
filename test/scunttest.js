var assert = require('assert');
var async = require('async')
var db = require('../database/db');
var seed = require("../database/seeders");

var scunt = require('../models/scavengerHunts');

describe('Scunt test', function () {

  before(function (done) {
    db.connect(db, function (err) {
      seed.up(function () {
        done();
      });
    });
  });

  it('Scunt creation Successful', function (done) {
    var name = 'frosh';
    var description = 'fresh meat';
    var startTime = new Date();
    var endTime = new Date();

    scunt.create(name, description, startTime, endTime, function (err, resultId) {
      assert.strictEqual(err, undefined);
      assert.notStrictEqual(resultId, undefined);

      var query = "SELECT * FROM scunt WHERE id = ?";
      values = [resultId];

      db.get().query(query, values, function (errQuery, result) {
        assert.strictEqual(errQuery, null);

        assert.strictEqual(result[0].name, name);
        assert.strictEqual(result[0].description, description);
        assert.notStrictEqual(result[0].startTime, null);
        assert.notStrictEqual(result[0].endTime, null);

        assert.notStrictEqual(result[0].createdAt, null);
        assert.notStrictEqual(result[0].updatedAt, null);
        done();
      });
    });

  });

  it('scunt already exist', function (done) {
    async.waterfall([
      function (callback) {
        var name = "Supa Frosh";
        var description = "nothing";
        var date = new Date();
        scunt.create(name, description, date, date, function (err, resultId) {
          if (err != undefined) {
            callback(err, undefined);
          } else {
            callback(undefined, resultId);
          }
        }
        );
      },
      function (ID, callback) {
        var name = "Supa Frosh";
        var description = "nothing";
        var date = new Date();
        scunt.create(name, description, date, date, function (err, resultId) {
          if (err != undefined) {
            callback(err, undefined);
          } else {
            callback(undefined, resultId);
          }
        }
        );
      }
    ],
      function (err, id) {

        assert.strictEqual(err, 'Scunt with same name already exist');
        done();
      }
    );
  }
  );



  it('Scunt update Succressful', function (done) {
    scunt.create('fish frosh', 'jesus loves you', new Date("September 1, 2016 11:13:00"), new Date("September 13, 2016 11:13:00"), function (err, id) {
      assert.strictEqual(err, undefined);
      var newName = 'NK Frosh';
      var newDesc = 'North Korea best Korea';
      var startTime = new Date("September 1, 2017 11:13:00");
      var endTime = new Date("September 13, 2017 11:13:00");

      scunt.update(id.toString(), newName, newDesc, startTime, endTime, function (err, dummy) {
        var query = "SELECT * FROM scunt WHERE id = ?";
        values = [id.toString()];

        db.get().query(query, values, function (errQuery, result) {
          assert.strictEqual(errQuery, null);

          assert.strictEqual(result[0].name, newName);
          assert.strictEqual(result[0].description, newDesc);
          assert.notStrictEqual(result[0].startTime, null);
          assert.notStrictEqual(result[0].endTime, null);

          assert.notStrictEqual(result[0].createdAt, result[0].updatedAt);
          done()
        });


      });
    });
  });

  it('scunt list', function (done) {
    async.waterfall([
      function (callback) {
        var Name = 'SK Frosh';
        var Desc = 'South Korea best Korea';
        var startTime = new Date("September 1, 2017 11:13:00");
        var endTime = new Date("September 13, 2017 11:13:00");

        scunt.create(Name, Desc, startTime, endTime, function (err, id) {
          callback(err, id);
        });

      },
      function (scuntId, callback) {
        scunt.list(
          function (err, result) {
            var foundScunt = false;
            for (var count = 0; count < result.length; count++) {
              if (result[count].id == scuntId) {
                foundScunt = true;
              }
            }
            assert.equal(foundScunt, true);
            callback(err);
          }
        );
      }
    ],
      function (err) {
        assert.equal(err, null);
        done();
      });
  });

  it('Scunt publish', function(done) {
    async.waterfall([
      function(callback) {
        var Name = 'PublishedScunt';
        var Desc = 'Published scunt';
        var startTime = new Date("September 1, 2017 11:13:00");
        var endTime = new Date("September 13, 2017 11:13:00");

        scunt.create(Name, Desc, startTime, endTime, function (err, id) {
          callback(err, id);
        });
      },
      function(id, callback) {
        scunt.setStatus(id, 'PUBLISHED', function(err, res) {
          callback(err, id);
        });
      },
      function(id, callback) {
        var query = "SELECT COUNT(*) AS published FROM scunt WHERE id = ? AND status = 'PUBLISHED'";
        var values = [id];

        db.get().query(query, values, function(err, res) {
          assert.equal(err, null);
          assert.equal(res[0].published, 1);
          callback(err);
        });
      }
    ], function(err) {
        assert.equal(err, null);
        done();
    });
  });
  
  it('Scunt publish invalid', function(done) {
    async.waterfall([
      function(callback) {
        var Name = 'NotPublishedScunt';
        var Desc = 'Not Published scunt';
        var startTime = new Date("September 1, 2017 11:13:00");
        var endTime = new Date("September 13, 2017 11:13:00");

        scunt.create(Name, Desc, startTime, endTime, function (err, id) {
          callback(err, id);
        });
      },
      function(id, callback) {
        scunt.setStatus(id, 'PUBLISHEDasdf', function(err, res) {
          assert.equal(err, 'An invalid status was used');
          callback(null);
        });
      }
    ], function (err) {
      assert.equal(err, null);
      done();
    });
  });
  
  it('Scunt Start', function(done) {
    async.waterfall([
      function(callback) {
        var Name = 'StartedScunt';
        var Desc = 'Started scunt';
        var startTime = new Date("September 1, 2017 11:13:00");
        var endTime = new Date("September 13, 2017 11:13:00");

        scunt.create(Name, Desc, startTime, endTime, function (err, id) {
          callback(err, id);
        });
      },
      function(id, callback) {
        scunt.setStatus(id, 'PUBLISHED', function(err, res) {
          callback(err, id);
        });
      },
      function(id, callback) {
        // Create users + teams for the scunt, two users + two teams, created and updated dates will be messed up here to keep the code short
        var query = `
          INSERT INTO users (username, firstName, lastName, email, password, phoneNumber, isAdmin, profilePicture, createdAt, updatedAt) VALUES 
          ("starteduser1", "startfname1", "startlname1", "startfname1@gmail.com", "1234", "1231231234", "1", "", "2017-01-01", "2017-01-01"),
          ("starteduser2", "startfname2", "startlname2", "startfname2@gmail.com", "1234", "1231231234", "1", "", "2017-01-01", "2017-01-01"),
          ("starteduser3", "startfname3", "startlname3", "startfname3@gmail.com", "1234", "1231231234", "1", "", "2017-01-01", "2017-01-01"),
          ("starteduser4", "startfname4", "startlname4", "startfname4@gmail.com", "1234", "1231231234", "1", "", "2017-01-01", "2017-01-01");
      
          INSERT INTO teams (name, points, maxmembers, scuntId, createdAt, updatedAt) VALUES 
          ("startteam1", "0", "3", ?, "2017-01-01", "2017-01-01"),
          ("startteam2", "0", "3", ?, "2017-01-01", "2017-01-01");
          
          INSERT INTO teamUserRel (teamId, userId, userType, createdAt, updatedAt)
          SELECT teams.id, users.id, "participant", "2017-01-01", "2017-01-01" FROM teams JOIN users ON 1 = 1 WHERE users.username IN ("starteduser1", "starteduser2") AND teams.name = "startteam1"
          UNION
          SELECT teams.id, users.id, "participant", "2017-01-01", "2017-01-01" FROM teams JOIN users ON 1 = 1 WHERE users.username IN ("starteduser3", "starteduser4") AND teams.name = "startteam2";

          INSERT INTO tasks (name, description, points, scuntId, createdAt, updatedAt) VALUES 
          ("startedscunttask1", "startedscunttask1 desc", 5, ?, "2017-01-01", "2017-01-01"),
          ("startedscunttask2", "startedscunttask2 desc", 5, ?, "2017-01-01", "2017-01-01")
        `;
        var values = [id, id, id, id];

        db.get().query(query, values, function(err, res) {
          assert.equal(err, null); // Make sure insertion worked out
          callback(err, id);
        })
      },
      function(id, callback) {
        // Start the scavenger hunt
        scunt.start(id, function(err) {
          assert.equal(err, null);
          callback(err, id);
        });
      }, 
      function(id, callback) {
        // Check that teamTaskRel table was was populated
        var query = 'SELECT COUNT(*) AS teamTasks from teamTaskRel JOIN teams ON teamTaskRel.teamId = teams.id WHERE teams.scuntId = ?';
        var values = [id];

        db.get().query(query, values, function(err, res) {
          assert.equal(err, null);
          assert.equal(res[0].teamTasks, 4)
          callback(err);
        });
      }
    ], function(err) {
        assert.equal(err, null);
        done();
    });
  });

  it('Scunt Close', function(done) {
    async.waterfall([
      function(callback) {
        var Name = 'closedScunt';
        var Desc = 'Closed scunt';
        var startTime = new Date("September 1, 2017 11:13:00");
        var endTime = new Date("September 13, 2017 11:13:00");

        scunt.create(Name, Desc, startTime, endTime, function (err, id) {
          callback(err, id);
        });
      },
      function(id, callback) {
        scunt.setStatus(id, 'PUBLISHED', function(err, res) {
          callback(err, id);
        });
      },
      function(id, callback) {
        // Create users + teams for the scunt, two users + two teams, created and updated dates will be messed up here to keep the code short
        var query = `
          INSERT INTO users (username, firstName, lastName, email, password, phoneNumber, isAdmin, profilePicture, createdAt, updatedAt) VALUES 
          ("closeduser1", "closefname1", "closelname1", "closefname1@gmail.com", "1234", "1231231234", "1", "", "2017-01-01", "2017-01-01"),
          ("closeduser2", "closefname2", "closelname2", "closefname2@gmail.com", "1234", "1231231234", "1", "", "2017-01-01", "2017-01-01"),
          ("closeduser3", "closefname3", "closelname3", "closefname3@gmail.com", "1234", "1231231234", "1", "", "2017-01-01", "2017-01-01"),
          ("closeduser4", "closefname4", "closelname4", "closefname4@gmail.com", "1234", "1231231234", "1", "", "2017-01-01", "2017-01-01");
      
          INSERT INTO teams (name, points, maxmembers, scuntId, createdAt, updatedAt) VALUES 
          ("closeteam1", "0", "3", ?, "2017-01-01", "2017-01-01"),
          ("closeteam2", "0", "3", ?, "2017-01-01", "2017-01-01");
          
          INSERT INTO teamUserRel (teamId, userId, userType, createdAt, updatedAt)
          SELECT teams.id, users.id, "participant", "2017-01-01", "2017-01-01" FROM teams JOIN users ON 1 = 1 WHERE users.username IN ("closeduser1", "closeduser2") AND teams.name = "closeteam1"
          UNION
          SELECT teams.id, users.id, "participant", "2017-01-01", "2017-01-01" FROM teams JOIN users ON 1 = 1 WHERE users.username IN ("closeduser3", "closeduser4") AND teams.name = "closeteam2";

          INSERT INTO tasks (name, description, points, scuntId, createdAt, updatedAt) VALUES 
          ("closedscunttask1", "closedscunttask1 desc", 5, ?, "2017-01-01", "2017-01-01"),
          ("closedscunttask2", "closedscunttask2 desc", 5, ?, "2017-01-01", "2017-01-01")
        `;
        var values = [id, id, id, id];

        db.get().query(query, values, function(err, res) {
          assert.equal(err, null); // Make sure insertion worked out
          callback(err, id);
        })
      },
      function(id, callback) {
        // Start the scavenger hunt
        scunt.start(id, function(err) {
          assert.equal(err, null);
          callback(err, id);
        });
      }, 
      function(id, callback) {
        // Check that teamTaskRel table was was populated
        var query = 'SELECT COUNT(*) AS teamTasks from teamTaskRel JOIN teams ON teamTaskRel.teamId = teams.id WHERE teams.scuntId = ?';
        var values = [id];

        db.get().query(query, values, function(err, res) {
          assert.equal(err, null);
          assert.equal(res[0].teamTasks, 4)
          callback(err,id);
        });
      },
      function(id, callback) {
        // Close the scavenger hunt
        scunt.close(id, function(err) {
          assert.equal(err, null);
          callback(err, id);
        });
      }, 
      function(id, callback) {
        // Check that teamTaskRel table was was populated
        var query = 'SELECT status from scunt WHERE id = ?';
        var values = [id];

        db.get().query(query, values, function(err, res) {

          assert.equal(err, null);
          assert.equal(res[0].status, "FINISHED");
          callback(err);
        });
      }
    ], function(err) {
        assert.equal(err, null);
        done();
    });
  });

  it('Scunt Close inexistent', function(done) {
    async.waterfall([
      function(callback) {
        var Name = 'badClosedScunt';
        var Desc = 'Bad Closed scunt';
        var startTime = new Date("September 1, 2017 11:13:00");
        var endTime = new Date("September 13, 2017 11:13:00");

        scunt.create(Name, Desc, startTime, endTime, function (err, id) {
          callback(err, id);
        });
      }, 
      function(id, callback) {
        // Check that teamTaskRel table was was populated
        scunt.delete(id, function (err, id) {
          callback(err, id);
        });
      },
      function(id, callback) {
        // close the scavenger hunt that is inexesistant
        scunt.close(id, function(err) {
          assert.equal(err, "Scunt with this id doesn\'t exist");
          callback();
        });
      }
    ], function(err) {
        assert.equal(err, null);
        done();
    });
  });

  it("Scunt get status", function(done){
    async.waterfall([
      function(callback) {
        var Name = 'StatusScunt';
        var Desc = 'Status scunt';
        var startTime = new Date("September 1, 2017 11:13:00");
        var endTime = new Date("September 13, 2017 11:13:00");

        scunt.create(Name, Desc, startTime, endTime, function (err, id) {
          callback(err, id);
        });
      },
      function(id, callback){
        scunt.setStatus(id, 'PUBLISHED', function(err, res) {
          callback(err, id);
        });      
      },
      function(id, callback){
        scunt.getStatus(id, function(err,result)
        {
          assert.strictEqual(err,null);
          assert.strictEqual(result[0].status, "PUBLISHED");
          callback(err);
        });
      }
    ],
    function(err){
      assert.equal(err,null);
      done();
    });
  });


});