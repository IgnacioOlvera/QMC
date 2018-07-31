var con = require('../conexion.js');
var express = require('express');
var api = express.Router();
var md_auth = require('../middlewares/autenticacion.js');
var md_nivel = require('../middlewares/nivel.js');
api.get('/almacen/:id?', [md_auth.ensureAuth, md_nivel.ensureLevel1], function (req, res) {
    let sql = "";
    if (req.params.id) {
        //Seleccionar un almacén en específico
        let id_almacen = req.params.id
        sql = `select * from almacenes where id_almacen=${id_almacen}`;
        con.query(sql, function (err, rows) {
            if (err) throw err
            else
                res.send(rows);
        });
        //Seleccionar todos los almacenes
    } else {
        sql = `select * from almacenes;`;
        con.query(sql, function (err, rows) {
            if (err) throw err
            else
                res.send(rows);
        });
    }
});

api.post('/almacen/:id', [md_auth.ensureAuth, md_nivel.ensureLevel1], function (req, res) {
    let sql = "";
    let b = req.params.id;//Bandera para identificar si es inserción o actualización

    if (req.body != null && (b == 0 || b == 1)) {
        let almacen = req.body,
            nombre = almacen.nombre,
            direccion = almacen.direccion,
            responsable = almacen.responsable;
        //Actualización de almacén.
        if (b == 0) {
            sql = `update almacenes set nombre='${nombre}',direccion='${direccion}',responsable='${responsable}'`;
            con.query(sql, function (err) {
                if (err) throw err
                else
                    res.send({ message: 'Almacén Editado Correctamente' });
            });
            //Inserción de almacén.
        } else if (b == 1) {
            sql = `insert into almacenes values(null,'${nombre}','${direccion}','${responsable}')`;
            con.query(sql, function (err) {
                if (err) throw err
                else
                    res.send({ message: 'Almacén Registrado Correctamente' });
            });

        }
    }
});
//Eliminar Almacén
api.delete('/almacen/:id', [md_auth.ensureAuth, md_nivel.ensureLevel1], function (req, res) {
    let id_almacen = req.params.id;
    let sql = `delete from almacenes where id_almacen=${id_almacen}`;
    con.query(sql, function (err) {
        if (err) throw err
        else res.send({ message: 'Almacén Borrado Exitosamente' });
    });
});

module.exports = api;