var mysql = require('mysql');
var con = mysql.createConnection({
    host: "us-cdbr-iron-east-04.cleardb.net",
    user: "b6cb2661d1e790",
    password: "69318445bc2b71f",
    database:"heroku_2585833ccd9edf4",
    timezone: 'utc'
});
module.exports=con;