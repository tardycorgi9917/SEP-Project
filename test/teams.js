var assert = require('assert');
var async = require('async');

var db = require('../database/db');
var seed = require('../database/seeders');
var teams = require('../models/teams');
var users = require('../models/users');
var scunts = require('../models/scavengerHunts');

describe('Teams Tests', function () {
    before(function (done) {
        db.connect(db, function (err) {
            seed.up(function () {
                done();
            });
        });
    });

    describe('Team Creation Tests', function () {
        it('Team should be created successfully', function (done) {
            async.waterfall([
                function (callback) {
                    // Create scavenger hunt
                    var scuntName = 'scuntteamtest1';
                    var scuntDesc = 'desc';
                    var scuntStart = new Date();
                    var scuntEnd = new Date();
                    scunts.create(scuntName, scuntDesc, scuntStart, scuntEnd, callback);
                },
                function (scuntId, callback) {
                    // Create user
                    var username = 'user11';
                    var firstName = 'fname11';
                    var lastName = 'lname';
                    var email = 'asdf8@gmail.com';
                    var pwd = '123';
                    var phonenumber = '213 546-7889';
                    var profilepic = '';
                    var date = new Date();
                    users.create(username, firstName, lastName, email, pwd, phonenumber, profilepic, date, function (err, id) {
                        callback(err, scuntId, id);
                    });
                },
                function (scuntId, userId, callback) {
                    // Create team
                    var name = 'testteam';
                    teams.create(name, 0, 2, scuntId, userId, function (err, id) {
                        assert.notStrictEqual(id, null, 'Could not create team, id was null');
                        assert.strictEqual(err, null, 'teams create has some invalid sql ' + err);

                        callback(err, id);
                    });
                },
            ], function (err, id) {
                assert.notStrictEqual(id, null, 'Could not create team, id was null');
                var query = 'SELECT name FROM teams WHERE id = ?';
                var values = [id];

                db.get().query(query, values, function (err, result) {
                    console.log(result);
                    assert.equal('testteam', result[0].name);
                    done();
                });
            })
        });

        it('Team should not be created successfully when scavenger hunt does not exist', function (done) {
            var name = 'testteamname';
            var scuntId = '-1';
            var leaderId = '1';

            teams.create(name, 0, 2, scuntId, leaderId, function (err, id) {
                assert.strictEqual(id, undefined);
                done();
            });
        });

        it('Cannot have two teams with the same name', function (done) {
            async.waterfall([
                function (callback) {
                    // Create scavenger hunt
                    var scuntName = 'scuntteamtest2';
                    var scuntDesc = 'desc';
                    var scuntStart = new Date();
                    var scuntEnd = new Date();
                    scunts.create(scuntName, scuntDesc, scuntStart, scuntEnd, callback);
                },
                function (scuntId, callback) {
                    // Create user 1
                    var username = 'user1';
                    var firstName = 'fname1';
                    var lastName = 'lname';
                    var email = 'asdf9@gmail.com';
                    var pwd = '123';
                    var phonenumber = '213 546-7889';
                    var profilepic = '';
                    var date = new Date();
                    users.create(username, firstName, lastName, email, pwd, phonenumber, profilepic, date, function (err, id) {
                        callback(err, scuntId, id);
                    });
                },
                function (scuntId, user1Id, callback) {
                    // Create user 2
                    var username = 'user2';
                    var firstName = 'fname2';
                    var lastName = 'lname2';
                    var email = 'asdf2@fgmail.com';
                    var pwd = '1232';
                    var phonenumber = '213 546-78892';
                    var profilepic = '';
                    var date = new Date();
                    users.create(username, firstName, lastName, email, pwd, phonenumber, profilepic, date, function (err, id) {
                        callback(err, scuntId, user1Id, id);
                    });
                },
                function (scuntid, user1id, user2id, callback) {
                    // create team 1
                    var name = 'testteam';
                    teams.create(name, 0, 2, scuntid, user1id, function (err, id) {
                        assert.strictEqual(err, null, 'teams create has some invalid sql ' + err);
                        callback(err, scuntid, user2id);
                    });
                },
                function (scuntId, user2Id, callback) {
                    // Create team 2 with the same name
                    var name = 'testteam';
                    teams.create(name, 0, 2, scuntId, user2Id, function (err, id) {
                        assert.strictEqual(err, 'A team with this name already exists in this scavenger hunt');
                        assert.strictEqual(id, undefined, 'Team should not have been created');
                        callback(null);
                    });
                }
            ], function (err) {
                assert.strictEqual(err, null, 'unknown error occured');
                done();
            });
        });

        it('Cannot create two different teams with the same user', function (done) {
            async.waterfall([
                function (callback) {
                    // Create scavenger hunt
                    var scuntName = 'scuntteamtest3';
                    var scuntDesc = 'desc';
                    var scuntStart = new Date();
                    var scuntEnd = new Date();
                    scunts.create(scuntName, scuntDesc, scuntStart, scuntEnd, callback);
                },
                function (scuntId, callback) {
                    // Create user
                    var username = 'user3';
                    var firstName = 'fname3';
                    var lastName = 'lname';
                    var email = 'asdf10@gmail.com';
                    var pwd = '123';
                    var phonenumber = '213 546-7889';
                    var profilepic = '';
                    var date = new Date();
                    users.create(username, firstName, lastName, email, pwd, phonenumber, profilepic, date, function (err, id) {
                        callback(err, scuntId, id);
                    });
                },
                function (scuntId, userId, callback) {
                    // create team 3
                    var name = 'teamtest3';
                    teams.create(name, 0, 2, scuntId, userId, function (err, id) {
                        assert.strictEqual(err, null, 'teams create has some invalid sql ' + err);
                        callback(err, scuntId, userId);
                    });
                },
                function (scuntId, userId, callback) {
                    // create team 4
                    var name = 'teamtest4';
                    teams.create(name, 0, 2, scuntId, userId, function (err, id) {
                        assert.strictEqual(err, "User already has a team");
                        callback(null);
                    });
                },
            ], function (err) {
                assert.strictEqual(err, null, 'unknown error occured ' + err);
                done();
            });
        });
    });

    describe('Team Deletion Tests', function () {
        it('Successful deletion', function (done) {
            async.waterfall([
                function (callback) {
                    // Create scavenger hunt
                    var scuntName = 'scuntteamtest4';
                    var scuntDesc = 'desc';
                    var scuntStart = new Date();
                    var scuntEnd = new Date();
                    scunts.create(scuntName, scuntDesc, scuntStart, scuntEnd, callback);
                },
                function (scuntId, callback) {
                    // Create user
                    var username = 'user4';
                    var firstName = 'fname4';
                    var lastName = 'lname4';
                    var email = 'asdf1@gmail.com';
                    var pwd = '123';
                    var phonenumber = '213 546-7889';
                    var profilepic = '';
                    var date = new Date();
                    users.create(username, firstName, lastName, email, pwd, phonenumber, profilepic, date, function (err, id) {
                        callback(err, scuntId, id);
                    });
                },
                function (scuntId, userId, callback) {
                    // create team 4
                    var name = 'teamtest4';
                    teams.create(name, 0, 2, scuntId, userId, function (err, id) {
                        assert.strictEqual(err, null, 'teams create has some invalid sql ' + err);
                        callback(err, id);
                    });
                },
                function (teamId, callback) {
                    teams.delete(teamId, function (err) {
                        callback(err, teamId);
                    });
                },
                function (teamId, callback) {
                    var query = 'SELECT COUNT(*) AS teamcount FROM teams WHERE id = ?';
                    var values = [teamId];

                    db.get().query(query, values, function (err, result) {
                        assert.equal(0, result[0].teamcount);
                        callback(null);
                    });
                }
            ], function (err) {
                assert.strictEqual(err, null, 'unknown error occured on happy path team deletion');
                done();
            });
        });

        it('should not crash when team doesn\'t exist', function (done) {
            teams.delete(-1, function (err) {
                done();
            });
        });

        it('should not be able to delete if during scunt', function(done)
        {
            async.waterfall([
                function(callback)
                {
                   var name = 'ScuntNumbaWan';
                   var desc = 'BestNumba';
                   var scuntStartDate = new Date();
                   var scuntEndDate = new Date();

                   scunts.create(name, desc, scuntStartDate, scuntEndDate,
                   function(err, id)
                   {
                        callback(err,id);
                   });
                },
                function(ScuntId,callback)
                {
                     // Create user
                    var username = 'NumbaWan';
                    var firstName = 'fname4';
                    var lastName = 'lname4';
                    var email = 'asdf1@gmail.com';
                    var pwd = '123';
                    var phonenumber = '213 546-7889';
                    var profilepic = '';
                    var date = new Date();
                    users.create(username, firstName, lastName, email, pwd, phonenumber, profilepic, date, function (err, id) {
                        callback(err, scuntId, id);
                    });                   
                } 
                ,
                function(callback)
                {
                    var name = 'teamNumbaWan';
                    teams.create();
                }


            ], function()
            {

            });


        });

    });


    describe('Adding user to team and joining', function () {
        it('Happy path adding to team', function (done) {
            async.waterfall([
                function (callback) {
                    // Create scavenger hunt
                    var scuntName = 'scuntteamtest5';
                    var scuntDesc = 'desc';
                    var scuntStart = new Date();
                    var scuntEnd = new Date();
                    scunts.create(scuntName, scuntDesc, scuntStart, scuntEnd, callback);
                },
                function (scuntId, callback) {
                    // Create user 1
                    var username = 'user5';
                    var firstName = 'fname5';
                    var lastName = 'lname';
                    var email = 'asdf2@gmail.com';
                    var pwd = '123';
                    var phonenumber = '213 546-7889';
                    var profilepic = '';
                    var date = new Date();
                    users.create(username, firstName, lastName, email, pwd, phonenumber, profilepic, date, function (err, id) {
                        callback(err, scuntId, id);
                    });
                },
                function (scuntId, user1Id, callback) {
                    // Create user 2
                    var username = 'user6';
                    var firstName = 'fname6';
                    var lastName = 'lname';
                    var email = 'asdf3@gmail.com';
                    var pwd = '123';
                    var phonenumber = '213 546-7889';
                    var profilepic = '';
                    var date = new Date();
                    users.create(username, firstName, lastName, email, pwd, phonenumber, profilepic, date, function (err, id) {
                        callback(err, scuntId, user1Id, id);
                    });
                },
                function (scuntId, user1Id, user2Id, callback) {
                    // create team 3
                    var name = 'teamtest6';
                    teams.create(name, 0, 2, scuntId, user1Id, function (err, id) {
                        assert.strictEqual(err, null, 'teams create has some invalid sql ' + err);
                        callback(err, id, user2Id);
                    });
                },
                function(teamId, user2Id, callback) {
                    teams.join('user6', teamId, false, function(err) {
                        assert.strictEqual(err, null, 'happy path adding to team failed -- ' + err);
                        callback(err);
                    });
                }
            ], function(err) {
                assert.strictEqual(err, null, 'unknown error occured');
                done();
            });
        });

        it('Should not be able to add a player of another team in the same scavenger hunt', function (done) {
            async.waterfall([
                function (callback) {
                    // Create scavenger hunt
                    var scuntName = 'scuntteamtest6';
                    var scuntDesc = 'desc';
                    var scuntStart = new Date();
                    var scuntEnd = new Date();
                    scunts.create(scuntName, scuntDesc, scuntStart, scuntEnd, callback);
                },
                function (scuntId, callback) {
                    // Create user 1
                    var username = 'user7';
                    var firstName = 'fname7';
                    var lastName = 'lname';
                    var email = 'asdf4@gmail.com';
                    var pwd = '123';
                    var phonenumber = '213 546-7889';
                    var profilepic = '';
                    var date = new Date();
                    users.create(username, firstName, lastName, email, pwd, phonenumber, profilepic, date, function (err, id) {
                        callback(err, scuntId, id);
                    });
                },
                function (scuntId, user1Id, callback) {
                    // Create user 2
                    var username = 'user8';
                    var firstName = 'fname8';
                    var lastName = 'lname';
                    var email = 'asdf5@gmail.com';
                    var pwd = '123';
                    var phonenumber = '213 546-7889';
                    var profilepic = '';
                    var date = new Date();
                    users.create(username, firstName, lastName, email, pwd, phonenumber, profilepic, date, function (err, id) {
                        callback(err, scuntId, user1Id, id);
                    });
                },
                function (scuntId, user1Id, user2Id, callback) {
                    // create team 1
                    var name = 'teamtest7';
                    teams.create(name, 0, 2, scuntId, user1Id, function (err, id) {
                        assert.strictEqual(err, null, 'teams create has some invalid sql ' + err);
                        callback(err, scuntId, user1Id, user2Id, id);
                    });
                },
                function (scuntId, user1Id, user2Id, team1Id, callback) {
                    // create team 2
                    var name = 'teamtest8';
                    teams.create(name, 0, 2, scuntId, user2Id, function (err, id) {
                        assert.strictEqual(err, null, 'teams create has some invalid sql ' + err);
                        callback(err, user1Id, user2Id, team1Id, id);
                    });
                },
                function(user1Id, user2Id, team1Id, team2Id, callback) {
                    teams.join("user7", team2Id, false, function(err) {
                        assert.strictEqual(err, 'User already has a team', 'happy path adding to team failed');
                        callback(null);
                    });
                }
            ], function(err) {
                assert.strictEqual(err, null, 'unknown error occured');
                done();
            });
        });

        it('Switch team using join', function (done) {
            async.waterfall([
                function (callback) {
                    // Create scavenger hunt
                    var scuntName = 'scuntteamtest7';
                    var scuntDesc = 'desc';
                    var scuntStart = new Date();
                    var scuntEnd = new Date();
                    scunts.create(scuntName, scuntDesc, scuntStart, scuntEnd, callback);
                },
                function (scuntId, callback) {
                    // Create user 1
                    var username = 'user9';
                    var firstName = 'fname9';
                    var lastName = 'lname';
                    var email = 'asdf6@gmail.com';
                    var pwd = '123';
                    var phonenumber = '213 546-7889';
                    var profilepic = '';
                    var date = new Date();
                    users.create(username, firstName, lastName, email, pwd, phonenumber, profilepic, date, function (err, id) {
                        callback(err, scuntId, id);
                    });
                },
                function (scuntId, user1Id, callback) {
                    // Create user 2
                    var username = 'user10';
                    var firstName = 'fname10';
                    var lastName = 'lname';
                    var email = 'asdf7@gmail.com';
                    var pwd = '123';
                    var phonenumber = '213 546-7889';
                    var profilepic = '';
                    var date = new Date();
                    users.create(username, firstName, lastName, email, pwd, phonenumber, profilepic, date, function (err, id) {
                        callback(err, scuntId, user1Id, id);
                    });
                },
                function (scuntId, user1Id, user2Id, callback) {
                    // create team 1
                    var name = 'teamtest7';
                    teams.create(name, 0, 2, scuntId, user1Id, function (err, id) {
                        assert.strictEqual(err, null, 'teams create has some invalid sql ' + err);
                        callback(err, scuntId, user1Id, user2Id, id);
                    });
                },
                function (scuntId, user1Id, user2Id, team1Id, callback) {
                    // create team 2
                    var name = 'teamtest8';
                    teams.create(name, 0, 2, scuntId, user2Id, function (err, id) {
                        assert.strictEqual(err, null, 'teams create has some invalid sql ' + err);
                        callback(err, user1Id, user2Id, team1Id, id);
                    });
                },
                function(user1Id, user2Id, team1Id, team2Id, callback) {
                    teams.join(user1Id, team2Id, true, function(err) {
                        assert.strictEqual(err, null, 'Something went wrong changing teams');
                        callback(err, user1Id, team2Id);
                    });
                },
                function(user1Id, team2Id, callback) {
                    query = 'SELECT COUNT(*) AS switchedCount FROM teamUserRel WHERE userId = ? AND teamId = ?';
                    values = [user1Id, team2Id];

                    db.get().query(query, values, function(err, result) {
                        assert.equal(1, result[0].switchedCount);
                        callback(err);
                    });
                }
            ], function(err) {
                assert.strictEqual(err, null, 'unknown error occured');
                done();
            })

        });
    });

    describe('team list', function(){

        it('list teams accurately', function(done){
            async.waterfall([
                function (callback) {
                    // Create scavenger hunt
                    var scuntName = 'Sadness';
                    var scuntDesc = 'desc';
                    var scuntStart = new Date();
                    var scuntEnd = new Date();
                    scunts.create(scuntName, scuntDesc, scuntStart, scuntEnd, callback);
                },
                function(scuntId, callback)
                {
                    var username = 'Freshmeat1';
                    var firstName = 'fname9';
                    var lastName = 'lname';
                    var email = 'polo1@gmail.com';
                    var pwd = '123';
                    var phonenumber = '213 546-7889';
                    var profilepic = '';
                    var date = new Date();
                    users.create(username, firstName, lastName, email, pwd, phonenumber, profilepic, date, function (err, id) {
                        userId = [];
                        userId.push(id);
                        callback(err, scuntId, userId);
                    });                   

                },
                function(scuntId, userId, callback ){

                    var username = 'Freshmeat2';
                    var firstName = 'fname9';
                    var lastName = 'lname';
                    var email = 'polo2@gmail.com';
                    var pwd = '123';
                    var phonenumber = '213 546-7889';
                    var profilepic = '';
                    var date = new Date();
                    users.create(username, firstName, lastName, email, pwd, phonenumber, profilepic, date, function (err, id2) {
                        userId.push(id2);
                        callback(err, scuntId, userId);
                    });                    
                },
                function (scuntId, userId, callback) {
                    // create team 1
                    var name = 'wanker1';
                    teams.create(name, 0, 2, scuntId, userId[0], function (err, id) {
                        assert.strictEqual(err, null, 'teams create has some invalid sql ' + err);
                        callback(err,userId, id);
                    });
                },
                function(userId,teamId , callback) {
                    teams.join("Freshmeat2", teamId, false, function(err) {
                        assert.strictEqual(err, null);
                        callback(err, userId, teamId);
                    });
                },
                function(userId, teamId, callback) {
                    teams.list(
                        function(err,result)
                        {

                            assert.notEqual(result.length, 0);
                            var i = 0;

                            while(i< result.length)
                            {
                                id = result[i].id
                                if(id == teamId )
                                {
                                    teamMember = result[i].teamUsers;

                                    assert.equal(teamMember.length,2);

                                    memberId1 = teamMember[0].userId;
                                    memberId2 = teamMember[1].userId;
                                    assert.notEqual(userId.indexOf(memberId1),-1);
                                    assert.notEqual(userId.indexOf(memberId2),-1);
                                }
                                i++;
                            }
                            
                            callback(err);                 
                        }
                    );
                }                
            ], 
                function(err){
                    assert.strictEqual(err,null);
                    done();

            });
        });

    });


});