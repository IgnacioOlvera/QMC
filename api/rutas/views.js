var express = require('express');
var api = express.Router();
var path = require("path");

api.get('/inicio', function (req, res) {
    res.sendFile(path.join(__dirname,'../../client/production/index.html'));
});
api.get('/recibo',function(req,res){
    res.sendFile(path.join(__dirname,'../../client/production/recibo.html'));
});
api.get('/envios',function(req,res){
    res.sendFile(path.join(__dirname,'../../client/production/envios.html'));
});
api.get('/reportes',function(req,res){
    res.sendFile(path.join(__dirname,'../../client/production/reportes.html'));
});
api.get('/clientesPag',function(req,res){
    res.sendFile(path.join(__dirname,'../../client/production/clientes.html'));
});
api.get('/contactosPag',function(req,res){
    res.sendFile(path.join(__dirname,'../../client/production/contactos.html'));
});
api.get('/movimientosPag',function(req,res){
    res.sendFile(path.join(__dirname,'../../client/production/movimientos.html'));
});
api.get('/partesPag',function(req,res){
    res.sendFile(path.join(__dirname,'../../client/production/partes.html'));
});
api.get('/reportes',function(req,res){
    res.sendFile(path.join(__dirname,'../../client/production/reportes.html'));
});

module.exports = api;