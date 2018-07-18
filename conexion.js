var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "qmc_mrp",
    timezone: 'utc'
});

module.exports = con;