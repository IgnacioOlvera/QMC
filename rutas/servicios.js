var con = require('../conexion.js');
var express = require('express');
var api = express.Router();

api.get('/servicio/:id?', function (req, res) {
    //Obtener a quién se le brinda un servicio en específico
    if (req.params.id) {
        var id_servicio = req.params.id;
        con.query(`select
        b.nom_servicio,
        a.id_cliente,
        a.nombre
      from (select * from servicios where id_servicio=${id_servicio}) b inner join clientes a on a.id_servicio = b.id_servicio;`, function (err, rows) {
            if (err) throw err
            else res.send(rows);
        });
        //Obtener el servicio que se le brinda a cada cliente.
    } else {
        con.query("select b.nom_servicio, a.id_cliente,a.nombre from servicios b inner join clientes a on a.id_servicio=b.id_servicio;", function (error, rows) {
            if (error) throw error
            else res.send(rows);
        });
    }
});

api.post('/servicio/:b', function (req, res) {
    let servicio = req.body;
    let sql = "";
    let b = req.params.b;//Bandera para determinar si es nuevo registro o actualización
    if (servicio != null&&(b==0||b==1)) {
        let id_servicio = servicio.id_servicio,
        nombre=servicio.nombre;

        if (id_servicio != null && nombre != null) {
            //Actualizar Servicio
            if (b == 0) {
                sql = `update servicios set nom_servicio='${nombre}' where id_servicio=${id_servicio}`;
                con.query(sql, function (err) {
                    if (err) throw err
                    else
                        res.status(200).send({ message: 'Servicio Editado Correctamente' })
                });
            }
            //Insertar Servicio
            else if (b == 1) {
                sql = `insert into servicios values(null,'${nombre}')`;
                con.query(sql, function (err) {
                    if (err) throw err
                    else
                        res.status(200).send({ message: 'Servicio Registrado Correctamente' })
                });
            }
        } else {
            res.send({ message: 'Falta Proporcionar Datos Obligatorios' });
        }
    } else {
        res.send({ message: 'Ocurrió un error' });
    }
});
//Eliminar Servicio
api.delete('/servicio/:id', function (req, res) {
    if (req.params.id != null) {
        let id = req.params.id
        con.query(`delete from servicios where id_servicio=${id}`, function (err) {
            if (err) throw err
            else
                res.status(200).send({ message: 'Servicio Eliminado correctamente' })
        });

    }
});

module.exports = api;