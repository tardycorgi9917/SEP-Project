var users = require('../models/users')
var db = require("../database/db")
var pop = {}

var user_pop = [
    {
        username : 'stephcurry30',
        firstName : "Stephen",
        lastName : "Curry",
        email : "stephcurry30@gsw.com",
        password : "splashbro1"
    },
    {
        username : 'klayThomps11',
        firstName : "Klay",
        lastName : "Thompson",
        email : "klaythomps11@gsw.com",
        password : "splashbro2"
    },
    {
        username : 'draygreen23',
        firstName : "Draymond",
        lastName : "Green",
        email : "draygreen23@gsw.com",
        password : "spartankick"
    },
    {
        username : 'javaleMcGee1',
        firstName : "Javale",
        lastName : "McGee",
        email : "JavaleMcGee1@gsw.com",
        password : "shaqtin"
    },
    {
        username : 'KevDurant35',
        firstName : "Kevin",
        lastName : "Durant",
        email : "kevdurant35@gsw.com",
        password : "durantula"
    },
    {
        username : 'lebjames23',
        firstName : "Lebron",
        lastName : "James",
        email : "lebjames23@cav.com",
        password : "theking"
    },
    {
        username : 'tristthomp',
        firstName : "Tristan",
        lastName : "Thompson",
        email : "tristthomp@cav.com",
        password : "maxdeal"
    },
    {
        username : 'kyrieIrving2',
        firstName : "Kyrie",
        lastName : "Irving",
        email : "kyrieIrving2@cav.com",
        password : "worldisflat"
    },
    {
        username : 'KevinLove0',
        firstName : "Kevin",
        lastName : "Love",
        email : "kevinlove0@cav.com",
        password : "injured"
    },
    {
        username : 'kylekorver26',
        firstName : "Kyle",
        lastName : "Korver",
        email : "kylekorver26@cav.com",
        password : "money"
    }
]

pop.users = function(done) {
    async.forEach(user_pop, function(){
        users.create()
    }, function(){
        done()
    })
}

