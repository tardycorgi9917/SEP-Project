var assert = require('assert');

var db = require('../database/db');
var seed = require("../database/seeders");
var teams = require('../models/teams');

describe('Teams Tests', function () {
    before(function (done) {
        db.connect(db, function () {
            seed.down(function () {
                seed.up(function () {
                    done();
                });
            });
        });
    });

    describe('Check for successful and unsuccessful team creation', function () {
        it('Team should be created successfully', function () {
            // TODO Need create scavenger hunt and user to be complete here
            var name = 'testteamname';
            var scuntId = '0';
            teams.create(name, scuntId, function (err, id) {
                assert.strictEqual(err, undefined);

                SELECT 

                db.get().query(query, values, function (err, result) {
            });
        });

        it('Team should not be created successfully', function () {
            var name = 'testteamname';
            var scuntId = '1';
            teams.create(name, scuntId, function (err, id) {
                console.log(err);
                assert.strictEqual(id, undefined);
            });
        })
    });
})

describe('Array', function () {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            assert.equal(-1, [1, 2, 3].indexOf(4));
        });
    });
});