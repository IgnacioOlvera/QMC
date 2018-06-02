var express = require('express');
var api = express.Router();
var path = require("path");

api.get('/inicio', function (req, res) {
    res.sendFile(path.join(__dirname,'../../client/production/index.html'));
});
api.get('/recibo',function(req,res){
    res.sendFile(path.join(__dirname,'../../client/production/recibo.html'));
});

module.exports = api;