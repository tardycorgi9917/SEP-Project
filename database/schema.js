var schema = {};

// Add SQL for Creating tables here! Below is an example for the users table
schema.users = {
    "name": "users",
    "fields" : {
        "id" : "int(11) NOT NULL",
        "firstname": "varchar(40) NOT NULL",
        "lastname" : "varchar(40) NOT NULL",
        "email" : "varchar(50) NOT NULL",
        "createdAt" : "datetime NOT NULL"
    },
    "post" : [
        "ALTER TABLE `users`ADD PRIMARY KEY (`id`);",
        "ALTER TABLE `users` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT"
    ]
}
// End of example

module.exports = schema;