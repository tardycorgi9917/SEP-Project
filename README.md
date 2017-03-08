<img src="https://travis-ci.com/tardycorgi9917/SEP-Project.svg?token=TPN2WPqMVXQd5t44ti9z&branch=master" />

# SEP Server

## Using the Server:
Since we are deploying using Heroku, you will not have to run the server locally. The only time you should run it locally is for development and testing. For testing the api, using postman is the way to go.

## Using the Database:
In order to connect to the database, you need to create a config.js file with the path /database/config.js. The file should look like this:

var config = {
    development: {
        database: {
            host:'',
            db:'',
            user:'',
            password: '',
        },
    },
    production: {
        database: {
            host: 'scuntprod.coua71lt8vnx.us-west-2.rds.amazonaws.com:3306',
            user: 'thomask',
            password: 'SEPecse428',
            db:    'scuntProd'
        }
    }
};
module.exports = config;


where development is your local DB and production will have to credentials for the AWS MySQL server. 
Choosing between development and production will be chosen using environment variables.

In order to push the schema, run:  npm start DB=up
In order to bring down the schema, run:  npm start DB=down

NOTE: It seems that the default MySQL port it looks for os 3306. If yours is different, simply add a field in the array in the config file.

## Populate Database With Sample Data

For a small set of data a simple npm test will fill the database with some usefule data. for a more extensive set of data, you can run "npm start seed". This is will ad a more complete dataset to the DB.
