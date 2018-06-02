var con = require('../conexion.js');
var express = require('express');
var api = express.Router();

api.get('/contacto/:id?', function (req, res) {
    if (req.params.id) {//Si existe id, seleccion todos los contactos de un cliente.
        var id_cliente = req.params.id;
        con.query(`select
        a.*,
        b.nombre cliente
      from contactos a inner join (select id_cliente, nombre from clientes where id_cliente=${id_cliente}) b on a.id_cliente = b.id_cliente;`, function (err, rows) {
                if (err) throw err
                else res.send(rows);
            });
        //Obtener información de todos los contactos.
    } else {
        con.query(`select a.*,b.nombre cliente from contactos a inner join clientes b on a.id_cliente=b.id_cliente;`, function (error, rows) {
            if (error) throw error
            else res.send(rows);
        });
    }
});

api.post('/contacto/:b', function (req, res) {
    let contacto = req.body;
    let sql = "";
    let b = req.params.b;//Bandera para determinar si es nuevo registro o actualización
    if (contacto != null && (b == 0 || b == 1)) {
        let id_contacto = contacto.id_contacto,
            nombre = contacto.nombre,
            telefono = contacto.telefono,
            extension = contacto.ext,
            correo = contacto.correo,
            id_cliente = contacto.id_cliente;

        if (id_contacto != null && nombre != null&&telefono!=null&&correo!=null&&id_cliente!=null) {
            //Actualizar Contacto
            if (b == 0) {
                sql = `update contactos set nombre='${nombre}', telefono='${telefono}',ext='${extension}',correo='${correo}',id_cliente=${id_cliente} where id_contacto=${id_contacto}`;
                con.query(sql, function (err) {
                    if (err) throw err
                    else
                        res.status(200).send({ message: 'Contacto Editado Correctamente' })
                });
            }
            //Insertar Contacto
            else if (b == 1) {
                sql = `insert into contactos values(null,'${nombre}','${telefono}','${extension}','${correo}',${id_cliente});`;
                con.query(sql, function (err) {
                    if (err) throw err
                    else
                        res.status(200).send({ message: 'Contacto Registrado Correctamente' })
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
api.delete('/contacto/:id', function (req, res) {
    if (req.params.id != null) {
        let id = req.params.id
        con.query(`delete from contactos where id_contacto=${id}`, function (err) {
            if (err) throw err
            else
                res.status(200).send({ message: 'Contacto Eliminado correctamente' })
        });

    }
});

module.exports = api;