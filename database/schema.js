var schema = {};

// Add SQL for Creating tables here! Below is an example for the users table

// type = {Admin, Organizer, Team Lead, Participant}
schema.users = {
    "name": "users",
    "fields" : {
        "id" : "int(11) NOT NULL",
        "firstname": "varchar(40) NOT NULL",
        "lastname" : "varchar(40) NOT NULL",
        "email" : "varchar(50) NOT NULL",
        "password" : "varchar(50) NOT NULL",
        "type" : "varchar(50) NOT NULL",
        "createdAt" : "datetime NOT NULL",
        "updatedAt" : "datetime NOT NULL"
    },
    "post" : [
        "ALTER TABLE `users`ADD PRIMARY KEY (`id`);",
        "ALTER TABLE `users` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT"
    ]
}

schema.scunt = {
    "name": "scunt",
    "fields": {
        "id": "int(11) NOT NULL",
        "teams": ["teams.id"],
        "organizer": ["users.id"]
        "start_time": "datetime NOT NULL",
        "end_time": "datetime NOT NULL",
        "createdAt" : "datetime NOT NULL",
        "updatedAt" : "datetime NOT NULL"
    },
    "post" : [
        "ALTER TABLE `scunt`ADD PRIMARY KEY (`id`);",
        "ALTER TABLE `scunt` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT"
    ]
}

schema.items = {
    "name": "items",
    "fields": {
        "id": "int(11) NOT NULL",
        "name": "varchar(50) NOT NULL",
        "description": "varchar(500)",
        "points": "int(5) NOT NULL",
        // TODO foreign key
        "scunt_id": "scunt.id",
        "createdAt" : "datetime NOT NULL",
        "updatedAt" : "datetime NOT NULL"
    },
    "post" : [
        "ALTER TABLE `items`ADD PRIMARY KEY (`id`);",
        "ALTER TABLE `items` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT"
    ]
}

schema.teams = {
    "name": "teams",
    "fields": {
        "id": "int(11) NOT NULL",
        // TODO foreign key to user id
        "leader":  "users.id",
        // TODO array of foreign keys
        "members": ["users.id"],
        "name": "varchar(20) NOT NULL",
        "points": "int(5) NOT NULL",
        // TODO foreign keys
        "scunt": "users.scunt",
        "createdAt" : "datetime NOT NULL",
        "updatedAt" : "datetime NOT NULL"
    },
    "post" : [
        "ALTER TABLE `teams`ADD PRIMARY KEY (`id`);",
        "ALTER TABLE `teams` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT"
    ]
}
// End of example

module.exports = schema;
