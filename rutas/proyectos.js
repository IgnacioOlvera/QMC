var con = require('../conexion.js');
var express = require('express');
var api = express.Router();
var md_auth = require('../middlewares/autenticacion.js');
var md_nivel = require('../middlewares/nivel.js');
api.get('/proyectos', md_nivel.ensureLevel2, function (req, res) {
    try {
        con.query('select p.*, c.nombre propietario from proyectos p inner join clientes c on p.id_cliente=c.id_cliente', function (err, rows) {
            if (err) throw err
            else res.send(rows);
        });
    } catch (ex) {
        res.redirect('/error');
    }
});

api.get('/proyectos/:id', md_nivel.ensureLevel2, function (req, res) {
    if (req.body != null && (req.params.id == 0 || req.params.id == 1)) {
        let proyecto = req.body;
        let option = req.params.id;
        try {
            if (option == 1) {
                //Insertar
                let sql = `insert into proyectos values(null,'${proyecto.proyecto}',${proyecto.propietario},1)`;
                con.query(sql, function (err) {
                    if (err) res.send({ message: 'Ocurrió un Error SQL', status: 500 })
                    else res.send({ message: 'Proyecto Registrado Correctamente', status: 200 });
                });
            } else if (option == 0) {
                //Actualizar
                con.query(`update proyectos set nombre='${proyecto.proyecto}', id_cliente=${proyecto.propietario} where id_proyecto=${proyecto.id_proyecto}`, function (err) {
                    if (err) res.send({ message: 'Ocurrió un Error SQL', status: 500 })
                    else res.send({ message: 'Proyecto Actualizado Correctamente', status: 200 })
                });
            }
        } catch (ex) {
            res.redirect('/error');
        }
    } else {
        res.send({ message: 'Falta Proporcionar Datos Obligatorios y/o Válidos', status: 500 });
    }
});

module.exports = api;