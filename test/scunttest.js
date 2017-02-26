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
});