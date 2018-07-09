var con = require('../conexion.js');
var express = require('express');
var api = express.Router();

api.get('/cliente/:id?/:idS?', function (req, res) {
    idS = req.params.idS;
    id = req.params.id;
    //Seleccionar un almacén en específico
    if (req.params.id && !req.params.idS) {
        var id_cliente = req.params.id;
        con.query(`select * from clientes where id_cliente=${id_cliente}`, function (err, rows) {
            if (err) throw err
            else res.send(rows);
        });
        //Seleccionar todos los clientes
    } else if (!req.params.id && !req.params.idS) {
        con.query("select * from clientes", function (error, rows) {
            if (error) throw error
            else res.send(rows);
        });
    } else if (idS != null && id != null) {
        con.query(`select * from clientes where id_cliente in(${id},${idS}) order by nat`, function (error, rows) {
            if (error) throw error
            else res.send(rows);
        });
    }
});

api.get('/clienteNat/:id?', function (req, res) {
    //Seleccionar un almacén en específico
    if (req.params.id) {
        var naturaleza = req.params.id;
        con.query(`select * from clientes where nat=${naturaleza}`, function (err, rows) {
            if (err) throw err
            else res.send(rows);
        });
        //Seleccionar todos los clientes
    } else {
        con.query("select * from clientes", function (error, rows) {
            if (error) throw error
            else res.send(rows);
        });
    }
});

api.post('/cliente/:b', function (req, res) {
    let cliente = req.body;
    let sql = "";
    let b = req.params.b;//Bandera para identificar si es actualización o inserción
    if (cliente != null && (b == 0 || b == 1)) {
        let id_cliente = cliente.id_cliente,
            nombre = cliente.nombre || null,
            direccion = cliente.direccion || null,
            rfc = (cliente.rfc == "") ? null : `'${cliente.rfc}'`,
            estado = cliente.estado || null,
            nat = cliente.nat;
        if (id_cliente != null && nombre != null && rfc != null, estado != null, nat != null) {
            //Actuazlición de cliente
            if (b == 0) {
                sql = `update clientes set nombre='${nombre}',direccion='${direccion}',rfc=${rfc},estado='${estado}',nat=${nat} where id_cliente=${id_cliente}`;
                con.query(sql, function (err) {
                    if (err) throw err
                    else
                        res.status(200).send({ message: 'Cliente Editado Correctamente', status: "200" })
                });
            }
            else if (b == 1) {//Inserción de Cliente
                sql = `insert into clientes values(null,'${nombre}','${direccion}',${rfc},null,'${estado}',${nat})`;
                con.query(sql, function (err) {
                    if (err) throw err//res.send({ message: 'Ocurrió un error SQL', status: "500" });
                    else
                        res.status(200).send({ message: 'Cliente Registrado Correctamente', status: "200" })
                });
            }
        } else {
            res.send({ message: 'Falta Proporcionar Datos Obligatorios', status: "500" });
        }
    } else {
        res.send({ message: 'Ocurrió un error', status: "500" });
    }
});
//Eliminar Cliente
api.delete('/cliente/:id', function (req, res) {
    if (req.params.id != null) {
        let id = req.params.id
        con.query(`delete from clientes where id_cliente=${id}`, function (err) {
            if (err) throw err
            else
                res.status(200).send({ message: 'Parte eliminada correctamente', status: "200" })
        });

    }
});
/////////////////////////////////////////////////////////Decidir si se queda o no////////////////////////////////////////////////////////////////////////////////////////////
//Seleccionar partes que provee el cliente
api.get('/proveedor/:id?', function (req, res) {
    let sql = "";
    if (req.params.id) {//si existe id en el URL, se selecciona las partes que surte el cliente
        let id_cliente = req.params.id
        sql = `select a.no_parte interior,a.no_parte_ext exterior,a.descripcion descripcion,a.cant_x_caja caja,a.cant_x_pallet pallet,a.existencia,a.cant_min,b.nombre proveedor,b.id_cliente id_proveedor,a.estado from partes a inner join (select id_cliente,nombre from clientes where id_cliente=${id_cliente}) b on a.id_proveedor=b.id_cliente;`;
        con.query(sql, function (err, rows) {
            if (err) throw err
            else res.send(rows);
        });
    } else {//Partes que surte el cliente.
        sql = `select a.no_parte interior,a.no_parte_ext exterior,a.descripcion descripcion,a.cant_x_caja caja,a.cant_x_pallet pallet,a.existencia,a.cant_min,b.nombre proveedor,b.id_cliente id_proveedor,a.estado estado from partes a inner join (select id_cliente,nombre from clientes) b on a.id_proveedor=b.id_cliente;`;
        con.query(sql, function (err, rows) {
            if (err) throw err
            else res.send(rows);
        });
    }
});

module.exports = api;