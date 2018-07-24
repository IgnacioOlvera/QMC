var bcrypt = require('bcrypt');
var express = require('express');
var api = express.Router();
var con = require('../conexion.js');
var md_auth = require('../middlewares/autenticacion.js');
var jwt = require('../services/jwt');

api.post('/log', function (req, res) {
    var params = req.body;
    var email = params.correo;
    var password = params.pass;

    con.query(`select * from usuarios where correo='${email}'`, function (err, rows) {
        if (err) throw err
        else {
            let usuario = rows[0];
            bcrypt.compare(password, usuario.pass, function (err, check) {
                if (check == true) {
                    res.send({ token: jwt.createToken(usuario), status: "200" });
                } else {
                    res.send({ message: 'Correo y/o Contraseña Incorrrectos' });
                }
            });
        }
    });
});

// api.get('/hash', md_auth.ensureAuth, function (req, res) {
//     // var salt = bcrypt.genSaltSync(10);
//     // let pass = bcrypt.hashSync(req.body.pass, salt);

//     // bcrypt.compare('#Mission03', req.body.pass, function (err, check) {
//     //     if (check) {
//     //         res.send("ok");
//     //     } else {
//     //         res.send("ño");
//     //     }
//     // });
//     res.send("Entra");
// });

module.exports = api;