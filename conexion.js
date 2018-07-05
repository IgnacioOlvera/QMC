var mysql = require('mysql');
var con = mysql.createConnection({
    host: "g8mh6ge01lu2z3n1.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "exvmv4cox4vu19dq",
    password: "nbxqrzgjrst4fvh5",
    database:"sgqd0fcpu2lki8lm",
    timezone: 'utc'
});
module.exports=con;