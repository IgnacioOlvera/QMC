var con = require('../conexion.js');
var express = require('express');
var api = express.Router();
var md_auth = require('../middlewares/autenticacion.js');
var md_nivel = require('../middlewares/nivel.js');

api.get('/cliente/:id?/:idS?', md_nivel.ensureLevel2, function (req, res) {
    idS = req.params.idS;
    id = req.params.id;
    //Seleccionar un almacén en específico
    if (req.params.id && !req.params.idS) {
        var id_cliente = req.params.id;
        try {
            con.query(`select * from clientes where id_cliente=${id_cliente}`, function (err, rows) {
                if (err) throw err
                else res.send(rows);
            });
        } catch (ex) {
            res.redirect('/error');
        }
        //Seleccionar todos los clientes
    } else if (!req.params.id && !req.params.idS) {
        try {
            con.query("select * from clientes", function (error, rows) {
                if (error) throw error
                else res.send(rows);
            });
        } catch (ex) {
            res.redirect('/error');
        }
    } else if (idS != null && id != null) {
        try {
            con.query(`select * from clientes where id_cliente in(${id},${idS}) order by nat`, function (error, rows) {
                if (error) throw error
                else res.send(rows);
            });
        } catch (ex) {
            res.redirect('/error');
        }
    }
});

api.get('/clienteNat/:id?', md_nivel.ensureLevel2, function (req, res) {
    //Seleccionar un almacén en específico
    if (req.params.id) {
        var naturaleza = req.params.id;
        try {
            con.query(`select * from clientes where nat=${naturaleza}`, function (err, rows) {
                if (err) throw err
                else res.send(rows);
            });
        } catch (ex) {
            res.redirect('/error');
        }
        //Seleccionar todos los clientes
    } else {
        try {
            con.query("select * from clientes", function (error, rows) {
                if (error) throw error
                else res.send(rows);
            });
        }
        catch (ex) {
            res.redirect('/error');
        }
    }
});

api.post('/cliente/:b', md_nivel.ensureLevel2, function (req, res) {
    let cliente = req.body;
    let sql = "";
    let b = req.params.b;//Bandera para identificar si es actualización o inserción
    if (cliente != null && (b == 0 || b == 1)) {
        let id_cliente = cliente.id_cliente,
            nombre = cliente.nombre || null,
            direccion = cliente.direccion || null,
            rfc = (cliente.rfc.trim() == "") ? null : `'${cliente.rfc}'`,
            estado = cliente.estado || null,
            nat = cliente.nat,
            rsocial = cliente.rsocial;
        if (id_cliente != null && nombre != null && rfc != null, estado != null, nat != null) {
            //Actuazlición de cliente
            if (b == 0) {
                sql = `update clientes set nombre='${nombre}',direccion='${direccion}',rfc=${rfc},estado='${estado}',nat=${nat},rsocial='${rsocial}' where id_cliente=${id_cliente}`;
                try {
                    con.query(sql, function (err) {
                        if (err) throw err
                        else
                            res.status(200).send({ message: 'Cliente Editado Correctamente', status: "200" })
                    });
                }
                catch (ex) {
                    res.redirect('/error');
                }
            }
            else if (b == 1) {//Inserción de Cliente
                sql = `insert into clientes values(null,'${nombre}','${direccion}',${rfc},null,'${estado}',${nat},'${rsocial}')`;
                try {
                    con.query(sql, function (err) {
                        if (err) throw err//res.send({ message: 'Ocurrió un error SQL', status: "500" });
                        else
                            res.status(200).send({ message: 'Cliente Registrado Correctamente', status: "200" })
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
//Eliminar Cliente
api.delete('/cliente/:id', md_nivel.ensureLevel2, function (req, res) {
    if (req.params.id != null) {
        let id = req.params.id
        try {
            con.query(`update clientes set estado='INACTIVO' where id_cliente=${id}`, function (err) {
                if (err) throw err
                else
                    res.status(200).send({ message: 'Cliente eliminada correctamente', status: "200" })
            });
        }
        catch (ex) {
            res.redirect('/error');
        }

    }
});
/////////////////////////////////////////////////////////Decidir si se queda o no////////////////////////////////////////////////////////////////////////////////////////////
//Seleccionar partes que provee el cliente
api.get('/proveedor/:id?', md_nivel.ensureLevel2, function (req, res) {
    let sql = "";
    if (req.params.id) {//si existe id en el URL, se selecciona las partes que surte el cliente
        let id_cliente = req.params.id
        sql = `select a.no_parte interior,a.no_parte_ext exterior,a.descripcion descripcion,a.cant_x_caja caja,a.cant_x_pallet pallet,a.existencia,a.cant_min,b.nombre proveedor,b.id_cliente id_proveedor,a.estado from partes a inner join (select id_cliente,nombre from clientes where id_cliente=${id_cliente}) b on a.id_proveedor=b.id_cliente;`;
        try {
            con.query(sql, function (err, rows) {
                if (err) throw err
                else res.send(rows);
            });
        } catch (ex) {
            res.redirect('/error');
        }
    } else {//Partes que surte el cliente.
        sql = `select a.no_parte      interior, a.no_parte_ext  exterior, a.precio precio ,a.descripcion   descripcion, a.cant_x_caja   caja, a.cant_x_pallet pallet, a.existencia, a.cant_min, b.nombre        proveedor, b.id_cliente    id_proveedor, a.estado estado ,a.id_proyecto id_proyecto, p.nombre proyecto,a.peso peso   from partes a inner join (select id_cliente, nombre from clientes) b on a.id_proveedor = b.id_cliente inner join proyectos p on a.id_proyecto = p.id_proyecto`;
        try {
            con.query(sql, function (err, rows) {
                if (err) throw err
                else res.send(rows);
            });
        } catch (ex) {
            res.redirect('/error');
        }
    }
});

module.exports = api;