var con = require('../conexion.js');
var express = require('express');
var api = express.Router();
var md_auth = require('../middlewares/autenticacion.js');
var md_nivel = require('../middlewares/nivel.js');
api.get('/proyectos', [md_auth.ensureAuth, md_nivel.ensureLevel1], function (req, res) {
    con.query('select p.*, c.nombre propietario from proyectos p inner join clientes c on p.id_cliente=c.id_cliente', function (err, rows) {
        if (err) throw err
        else res.send(rows);
    });
});

api.post('/proyectos/:id',[ md_auth.ensureAuth, md_nivel.ensureLevel1], function (req, res) {
    if (req.body != null && (req.params.id == 0 || req.params.id == 1)) {
        let proyecto = req.body;
        let option = req.params.id;
        if (option == 1) {
            //Insertar
            let sql = `insert into proyectos values(null,'${proyecto.proyecto}',${proyecto.propietario},1)`;
            con.query(sql, function (err) {
                if (err) throw err
                else res.send({ message: 'Proyecto Registrado Correctamente', status: 200 });
            });
        } else if (option == 0) {
            //Actualizar
            con.query(`update proyectos set nombre='${proyecto.proyecto}', id_cliente=${proyecto.propietario} where id_proyecto=${proyecto.id_proyecto}`, function (err) {
                if (err) throw err
                else res.send({ message: 'Proyecto Actualizado Correctamente', status: 200 })
            });
        }
    } else {
        res.send({ message: 'Falta Proporcionar Datos Obligatorios y/o Válidos', status: 500 });
    }
});

module.exports = api;