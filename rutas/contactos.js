var con = require('../conexion.js');
var express = require('express');
var api = express.Router();
var md_auth = require('../middlewares/autenticacion.js');
var md_nivel = require('../middlewares/nivel.js');

api.get('/contacto/:id?', md_nivel.ensureLevel2, function (req, res) {
    if (req.params.id) {//Si existe id, seleccion todos los contactos de un cliente.
        var id_cliente = req.params.id;
        try {
            con.query(`select
        a.*,
        b.nombre cliente
      from contactos a inner join (select id_cliente, nombre from clientes where id_cliente=${id_cliente}) b on a.id_cliente = b.id_cliente;`, function (err, rows) {
                    if (err) throw err
                    else res.send(rows);
                });
        } catch (ex) {
            res.redirect('/error');
        }
        //Obtener información de todos los contactos.
    } else {
        try {
            con.query(`select a.*,b.nombre cliente,b.id_cliente from contactos a inner join clientes b on a.id_cliente=b.id_cliente;`, function (error, rows) {
                if (error) throw error
                else res.send(rows);
            });
        } catch (ex) {
            res.redirect('/error');
        }
    }
});

api.post('/contacto/:b', md_nivel.ensureLevel2, function (req, res) {
    let contacto = req.body;
    let sql = "";
    let b = req.params.b;//Bandera para determinar si es nuevo registro o actualización

    if (contacto != null && (b == 0 || b == 1)) {
        let id_contacto = contacto.id_contacto,
            nombre = contacto.nombre || null,
            telefono = (contacto.telefono == "") ? null : `'${contacto.telefono}'`,
            extension = (contacto.ext == "") ? null : `'${contacto.ext}'`,
            correo = (contacto.correo == "") ? null : `'${contacto.correo}'`,
            id_cliente = contacto.cliente || null,
            estado = contacto.estado;
        if (nombre != null && telefono != null && correo != null && id_cliente != null) {
            //Actualizar Contacto
            if (b == 0) {
                sql = `update contactos set nombre='${nombre}', telefono=${telefono},ext=${extension},correo=${correo},id_cliente=${id_cliente}, estado=${estado} where id_contacto=${id_contacto}`;
                try {
                    con.query(sql, function (err) {
                        if (err) res.send({ message: 'Ocurrió un error', status: "500" });
                        else
                            res.status(200).send({ message: 'Contacto Editado Correctamente', status: "200" })
                    });
                } catch (ex) {
                    res.redirect('/error');
                }
            }
            //Insertar Contacto
            else if (b == 1) {
                sql = `insert into contactos values(null,'${nombre}',${telefono},${extension},${correo},${id_cliente},${estado});`;
                try {
                    con.query(sql, function (err) {
                        if (err) tres.send({ message: 'Ocurrió un error', status: "500" });
                        else
                            res.status(200).send({ message: 'Contacto Registrado Correctamente', status: "200" })
                    });
                } catch (ex) {
                    res.redirect('/error');
                }
            }
        } else {
            res.send({ message: 'Falta Proporcionar Datos Obligatorios', status: "500" });
        }
    } else {
        res.send({ message: 'Ocurrió un error', status: "500" });
    }
});
//Eliminar Contacto
api.put('/contacto/:id', md_nivel.ensureLevel2, function (req, res) {
    if (req.params.id != null) {
        let id = req.params.id
        try {
            con.query(`update contactos set estado = 0 where id_contacto=${id}`, function (err) {
                if (err) res.status(500).send({ message: 'Ocurrió un error', status: "500" })
                else
                    res.status(200).send({ message: 'Contacto Eliminado correctamente', status: "200" })
            });
        } catch (ex) {
            res.redirect('/error');
        }

    }
});

module.exports = api;