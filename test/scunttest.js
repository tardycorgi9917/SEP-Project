var assert = require('assert');

var db = require('../database/db');
var seed = require("../database/seeders");

var scunt = require('../models/scavengerHunts');

describe('Scunt test', function () {
  before(function (done) {
    db.connect(db, function (err) {
      seed.down(function () {
        seed.up(function () {
          done();
        });
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

      db.get().query(query, values, function(errQuery,result){
        assert.strictEqual(errQuery,null);

        assert.strictEqual(result[0].name, name);
        assert.strictEqual(result[0].description, description);
        assert.notStrictEqual(result[0].startTime, null);
        assert.notStrictEqual(result[0].endTime, null);

        assert.notStrictEqual(result[0].createdAt, null );
        assert.notStrictEqual(result[0].updatedAt, null );

      } );


      done();
    });

  });

  it('Scunt update Succresstul', function (done) {
    scunt.create('fish frosh', 'jesus loves you', new Date("September 1, 2016 11:13:00"), new Date("September 13, 2016 11:13:00"), function (err, id) {
      assert.strictEqual(err, undefined);
      var newName = 'NK Frosh';
      var newDesc = 'North Korea best Korea';
      var startTime = new Date("September 1, 2017 11:13:00");
      var endTime = new Date("September 13, 2017 11:13:00");

      scunt.update(id.toString(), newName, newDesc, startTime, endTime, function (err, dummy) {
        var query = "SELECT * FROM scunt WHERE id = ?";
        values = [id.toString()];        

        db.get().query(query, values, function(errQuery,result){
          assert.strictEqual(errQuery,null);

          assert.strictEqual(result[0].name, newName);
          assert.strictEqual(result[0].description, newDesc);
          assert.notStrictEqual(result[0].startTime, null);
          assert.notStrictEqual(result[0].endTime, null);

          assert.notStrictEqual(result[0].createdAt, result[0].updatedAt );

      } );

        done()
      });
    });
  });
});