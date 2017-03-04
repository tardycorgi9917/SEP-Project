var config = {
    development: {
        database: {
            host:'127.0.0.1',
            db: 'sep_db',
            user:'root',
            password: 'root',
        },
    },
   test : {
        database: {
            host:'localhost',
            db:'sep_test',
            user:'root',
            password: '',
        },
    },
    production: {
        database: {
            host: 'scuntprod.coua71lt8vnx.us-west-2.rds.amazonaws.com',
            user: 'thomask',
            password: 'SEPecse428',
            db:    'scuntProd'
        }
    }
};
module.exports = config;