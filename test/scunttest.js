var assert = require('assert');

var db = require('../database/db');
var seed = require("../database/seeders");

var scunt = require('../models/scavengerHunts');



describe('Scunt test', function() {



  describe('Check if scunt create is succesful', function(done) {
      it('Scunt creation Successful',function(){

        var name = 'frosh';
        var description = 'fresh meat';
        var startTime = new Date("September 1, 2016 11:13:00");
        var endTime = new Date("September 13, 2016 11:13:00");

        scunt.create(name, description, startTime, endTime , function(err, Result){
          assert.strictEqual(err, undefined);
          /*
          assert.strictEqual(Result.description, description);
          assert.strictEqual(Result.startTime, startTime.toISOString().slice(0,19).replace('T', ' '));
          assert.strictEqual(Result.endTime, endTime.toISOString().slice(0,19).replace('T', ' '));               
          */
        });       

      });

    it('Scunt update Succresstul', function(){

      scunt.create('fish frosh', 'jesus loves you', new Date("September 1, 2016 11:13:00"),new Date("September 13, 2016 11:13:00") , function(err, id){

        assert.strictEqual(err, undefined);
        var newName = 'NK Frosh';
        var newDesc = 'North Korea best Korea';
        var startTime = new Date("September 1, 2017 11:13:00");
        var endTime = new Date("September 13, 2017 11:13:00");


        scunt.update(id.toString(),newName, newDesc, startTime, endTime, function(err,modifyResult){
            assert.strictEqual(-1,7);
            
        });

      });

    });      
  });


});