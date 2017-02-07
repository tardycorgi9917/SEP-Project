var config = {
    development: {
        database: {
            host:'',
            db:'',
            user:'',
            password: ''
        },
    },
    production: {
        database: {
            host: 'scuntprod.coua71lt8vnx.us-west-2.rds.amazonaws.com:3306',
            user: 'xxx',
            password: 'xxx',
            db: 'scuntProd'
        }
    }
};

module.exports = config;