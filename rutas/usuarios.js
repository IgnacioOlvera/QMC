var bcrypt = require('bcrypt');
var express = require('express');
var api = express.Router();
var con = require('../conexion.js');
var jwt = require('../services/jwt');
var md_nivel = require('../middlewares/nivel.js');
api.post('/log', function (req, res) {
    var params = req.body;
    var email = params.correo;
    var password = params.pass;

    con.query(`select * from usuarios where correo='${email}'`, function (err, rows) {
        if (err) throw err
        else {
            try {
                if (rows.length > 0) {
                    let usuario = rows[0];
                    bcrypt.compare(password, usuario.pass, function (err, check) {
                        if (check == true) {
                            res.send({ token: jwt.createToken(usuario), status: 200, lvl: usuario.nivel });
                        } else {
                            res.send({ message: 'Correo y/o Contraseña Incorrrectos', status: 500 });
                        }
                    });
                }
            } catch (e) {
                res.send({ message: 'Ocurrió un Error', status: 500 });
            }
        }
    });
});

api.get('/users', md_nivel.ensureLevel1, function (req, res) {
    con.query('select nombre, nivel, correo, id_usuario from usuarios', function (err, rows) {
        if (err) throw err
        else res.send(rows);
    });
});

api.post('/NuevoUsuario', md_nivel.ensureLevel1, function (req, res) {
    let usuario = req.body;
    let salt = bcrypt.genSaltSync(10);
    let pass = bcrypt.hashSync(usuario.contraseña, salt);
    con.query(`insert into usuarios values(null,'${usuario.nombre}','${pass}','${usuario.correo}',${usuario.nivel})`, function (err) {
        (err) ? res.send({ message: 'Ocurrió un error SQL', status: 500 }) : res.send({ message: 'Usuario Registrado Correctamente', status: 200 });
    });
});

api.delete('/usuario/:id', function (req, res) {
    let id = req.params.id;
    con.query('delete from usuarios where id_usuario=' + id, function (err) {
        (err) ? console.log(err) : res.send({ message: 'Usuario Eliminado Correctamente', status: 200 });
    });
});

api.get('/hash/:pass', md_nivel.ensureLevel1, function (req, res) {
    var salt = bcrypt.genSaltSync(10);
    let pass = bcrypt.hashSync(req.params.pass, salt);
    res.send(pass);
    bcrypt.compare('#Mission03', req.body.pass, function (err, check) {
        if (check) {
            res.send("ok");
        } else {

        }
    });
});

module.exports = api;