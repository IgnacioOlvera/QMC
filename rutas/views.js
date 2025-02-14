var express = require('express');
var api = express.Router();
var path = require("path");
var md_auth = require('../middlewares/autenticacion.js');
var md_nivel = require('../middlewares/nivel.js');

api.get('/inicio', md_auth.ensureAuth, function (req, res) {
    res.sendFile(path.join(__dirname, '../client/production/index.html'));
});
api.get('/recibo', md_auth.ensureAuth, function (req, res) {
    res.sendFile(path.join(__dirname, '../client/production/recibo.html'));
});
api.get('/envios', md_auth.ensureAuth, function (req, res) {
    res.sendFile(path.join(__dirname, '../client/production/envios.html'));
});
api.get('/reportes', md_auth.ensureAuth, function (req, res) {
    res.sendFile(path.join(__dirname, '../client/production/reportes.html'));
});
api.get('/clientesPag', md_auth.ensureAuth, function (req, res) {
    res.sendFile(path.join(__dirname, '../client/production/clientes.html'));
});
api.get('/contactosPag', md_auth.ensureAuth, function (req, res) {
    res.sendFile(path.join(__dirname, '../client/production/contactos.html'));
});
api.get('/movimientosPag', md_auth.ensureAuth, function (req, res) {
    res.sendFile(path.join(__dirname, '../client/production/movimientos.html'));
});
api.get('/partesPag', md_auth.ensureAuth, function (req, res) {
    res.sendFile(path.join(__dirname, '../client/production/partes.html'));
});
api.get('/reportes', md_auth.ensureAuth, function (req, res) {
    res.sendFile(path.join(__dirname, '../client/production/reportes.html'));
});
api.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/production/login.html'));
});
api.get('/qc', md_auth.ensureAuth, function (req, res) {
    res.sendFile(path.join(__dirname, '../client/production/qc.html'));
});
api.get('/svc', md_auth.ensureAuth, function (req, res) {
    res.sendFile(path.join(__dirname, '../client/production/svc.html'));
});
api.get('/usuarios', md_auth.ensureAuth, function (req, res) {
    res.sendFile(path.join(__dirname, '../client/production/usuarios.html'));
});
api.get('/error', function (req, res) {
    res.sendfile(path.join(__dirname, '../client/production/page_500.html'))
});
module.exports = api;