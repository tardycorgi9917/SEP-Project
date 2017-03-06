var config = { 
    development: { 
        database: { 
            host:'localhost', 
            db:'scuntDev', 
            user:'root', 
            password: 'xxxxxxxx', 
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