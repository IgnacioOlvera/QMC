//Dependencias
var express = require('express');
var bodyParser = require('body-parser');
var path = require("path");
var cookieParser = require('cookie-parser');
//Importación de Rutas
var rutas_partes = require('./rutas/partes.js');
var rutas_almaces = require('./rutas/almacenes.js');
var rutas_clientes = require('./rutas/clientes.js');
var rutas_servicios = require('./rutas/servicios.js');
var rutas_contactos = require('./rutas/contactos.js');
var rutas_movimientos = require('./rutas/movimientos.js');
var rutas_vistas = require('./rutas/views.js');
var rutas_archivos = require('./rutas/archivos.js');
var rutas_proyectos = require('./rutas/proyectos.js');
var rutas_usuarios = require('./rutas/usuarios.js');
var rutas_android = require('./rutas/api-android.js');


var app = express();
app.use(cookieParser());
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', '*');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var publicPath = path.join(__dirname, './client'); //path.join(__dirname, 'public'); también puede ser una opción
var publicImages = path.join(__dirname, './client/production/images');
// Para que los archivos estaticos queden disponibles.
app.use(express.static(publicPath));
app.use(express.static(publicImages));
//Carga de Rutas
app.use(rutas_partes);
app.use(rutas_almaces);
app.use(rutas_clientes);
app.use(rutas_servicios);
app.use(rutas_contactos);
app.use(rutas_movimientos);
app.use(rutas_vistas);
app.use(rutas_archivos);
app.use(rutas_proyectos);
app.use(rutas_usuarios);
app.use(rutas_android);

module.exports = app;