var schema = {};

schema.users = {
    "name": "users",
    "fields" : {
        "id" : "int(11) NOT NULL AUTO_INCREMENT",
        "username": "varchar(200) NOT NULL",
        "firstName": "varchar(200) NOT NULL",
        "lastName" : "varchar(200) NOT NULL",
        "email" : "varchar(200) NOT NULL",
        "password" : "varchar(255) NOT NULL",
        "phoneNumber" : "varchar(50)",
        "isPhoneNumberVisible": "varchar(5) NOT NULL DEFAULT 'true'",
        "isAdmin": "varchar(5) NOT NULL",
        "profilePicture" : "TEXT",
        "createdAt" : "datetime NOT NULL",
        "updatedAt" : "datetime NOT NULL"
    },
    "constraints": [
        "PRIMARY KEY (id)",
        "CONSTRAINT username UNIQUE (username)",
        "CONSTRAINT email UNIQUE (email)",
    ],
};

schema.scunt = {
    "name": "scunt",
    "fields": {
        "id": "int(11) NOT NULL AUTO_INCREMENT",
        "name" : "varchar(50) NOT NULL",
        "description" : "varchar(500) NOT NULL",
        "status": "varchar(50) NOT NULL",
        "startTime": "datetime",
        "endTime": "datetime",
        "createdAt" : "datetime NOT NULL",
        "updatedAt" : "datetime NOT NULL"
    },
    "constraints": [
        "PRIMARY KEY (id)"
    ],
};

schema.teams = {
    "name": "teams",
    "fields": {
        "id": "int(11) NOT NULL AUTO_INCREMENT",
        "name": "varchar(50) NOT NULL",
        "points": "int(10) NOT NULL",
        "maxMembers": "int(10) NOT NULL",
        "scuntId": "int(11) NOT NULL",
        "driveLink": "varchar(500) NOT NULL",
        "createdAt" : "datetime NOT NULL",
        "updatedAt" : "datetime NOT NULL"
    },
    "constraints": [
        "PRIMARY KEY (id)",
        "FOREIGN KEY (scuntId) REFERENCES scunt(id) ON DELETE CASCADE"
    ],
};

schema.tasks = {
    "name": "tasks",
    "fields": {
        "id": "int(11) NOT NULL AUTO_INCREMENT",
        "name": "varchar(50) NOT NULL",
        "description": "varchar(500)",
        "points": "int(10) NOT NULL",
        "scuntId": "int(11) NOT NULL",
        "createdAt" : "datetime NOT NULL",
        "updatedAt" : "datetime NOT NULL"
    },
    "constraints": [
        "PRIMARY KEY (id)",
        "FOREIGN KEY (scuntId) REFERENCES scunt(id) ON DELETE CASCADE"
    ],
};

schema.teamUserRel = {
    "name": "teamUserRel",
    "fields": {
        "teamId" : "int(11) NOT NULL",
        "userId" : "int(11) NOT NULL",
        "userType" : "varchar(50) NOT NULL",
        "createdAt" : "datetime NOT NULL",
        "updatedAt" : "datetime NOT NULL"
    },
    "constraints": [
        "FOREIGN KEY (teamId) REFERENCES teams(id) ON DELETE CASCADE",
        "FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE",
        "CONSTRAINT teamUserId UNIQUE (teamId,userId)"
    ],
};

schema.scuntUserRel = {
    "name": "scuntUserRel",
    "fields": {
        "scuntId" : "int(11) NOT NULL",
        "userId" : "int(11) NOT NULL",
        "createdAt" : "datetime NOT NULL",
        "updatedAt" : "datetime NOT NULL"
    },
    "constraints": [
        "FOREIGN KEY (scuntId) REFERENCES scunt(id) ON DELETE CASCADE",
        "FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE",
        "CONSTRAINT scuntUserId UNIQUE (scuntId,userId)"
    ],
};

schema.teamTaskRel = {
    "name": "teamTaskRel",
    "fields": {
        "teamId": "int(11) NOT NULL",
        "taskId": "int(11) NOT NULL",
        "status": "varchar(50) NOT NULL",
        "createdAt" : "datetime NOT NULL",
        "updatedAt" : "datetime NOT NULL",
    },
    "constraints": [
        "FOREIGN KEY (teamId) REFERENCES teams(id) ON DELETE CASCADE",
        "FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE",
        "CONSTRAINT teamTaskId UNIQUE (teamId, taskId)"
    ]
}

schema.comments = {
    "name": "comments",
    "fields": {
        "id": "int(11) NOT NULL AUTO_INCREMENT",
        "taskId": "int(11) NOT NULL",
        "userId": "int(11) NOT NULL",
        "comment": "text NOT NULL",
        "createdAt": "datetime NOT NULL"
    },
    "constraints": [
        "PRIMARY KEY (id)",
        "FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE",
        "FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE",
    ],
}

module.exports = schema;
