var con = require('../conexion.js');
var express = require('express');
var api = express.Router();
//Regresa historial de movimientos
api.get('/movimientos', function (req, res) {
    let sql = `select m.*, a.nombre almacen, (select nombre from clientes where id_cliente = m.id_proveedor) proveedor, (select nombre from clientes where id_cliente = m.id_destino)destino, p.no_parte, p.descripcion from movimientos_almacenes m, almacenes a, partes p where m.id_almacen = a.id_almacen and m.no_parte = p.no_parte order by fecha;`;
    con.query(sql, function (err, rows) {
        if (err) throw err
        else res.send(rows);
    });
});
//Regresa hostorial de Entradas
api.get('/entradas', function (req, res) {
    let sql = `select m.*, a.nombre almacen, (select nombre from clientes where id_cliente = m.id_proveedor) proveedor, (select nombre from clientes where id_cliente = m.id_destino) destino, p.no_parte, p.descripcion from movimientos_almacenes m, almacenes a, partes p where m.id_almacen = a.id_almacen and m.no_parte = p.no_parte and m.id_destino is null order by fecha;`;
    con.query(sql, function (err, rows) {
        if (err) throw err
        else res.send(rows);
    });
});
//Regresa Historial de Salidas
api.get('/salidas', function (req, res) {
    let sql = `select m.*, a.nombre 1almacen, (select nombre from clientes where id_cliente = m.id_proveedor) proveedor, (select nombre from clientes where id_cliente = m.id_destino)   destino, p.no_parte, p.descripcion from movimientos_almacenes m, almacenes a, partes p where m.id_almacen = a.id_almacen and m.no_parte = p.no_parte and m.id_destino is not null order by fecha;`
    con.query(sql, function (err, rows) {
        if (err) throw err
        else res.send(rows);
    });
});

//Registrar entrada de piezas
api.post('/entradas', function (req, res) {
    let entrada = req.body;
    let
        proveedor = entrada.id_proveedor || null,
        parte = entrada.id_parte || null,
        cantidad = entrada.cant_parte || null,
        fecha = entrada.fecha || null,
        contenedor = (entrada.id_candado=="") ? null : `'${entrada.id_contenedor}'`,
        candado = (entrada.id_candado=="") ? null : `'${entrada.id_candado}'`,
        secuencia = entrada.secuencia || null;
    if (entrada != null) {
        if (proveedor != null && parte != null && cantidad != null && fecha != null && cantidad > 0) {
            if (secuencia != null) {
                let sql = `insert into movimientos_almacenes values(null,1,${proveedor},null,${parte},${cantidad},str_to_date('${fecha}','%d/%m/%Y %T'),null,${contenedor},${candado},${secuencia})`;
                con.query(sql, function (err) {
                    if (err) throw err
                    else {
                        sql = `insert into costales (select id_movimiento, fecha,no_parte,secuencia from movimientos_almacenes where secuencia is not null and secuencia='${secuencia}' and id_destino is null and id_movimiento not in(select id_movimiento from costales));`;
                        con.query(sql, function (err) {
                            if (err) throw err
                            else res.send({ message: `Costal ${secuencia} Registrado Correctamente` });
                        });
                    }
                });
            } else if (secuencia == null) {
                let sql = `insert into movimientos_almacenes values(null,1,${proveedor},null,${parte},${cantidad},str_to_date('${fecha}','%d/%m/%Y %T'),null,${contenedor},${candado},null)`;
                con.query(sql, function (err) {
                    if (err) throw err
                    else {

                        sql = `update partes set existencia=existencia+${cantidad} where no_parte=${parte};`;
                        con.query(sql, function (err) {
                            if (err) throw err
                            else res.send({ message: 'Entrada Registrada Correctamente' });
                        });
                    }
                })

            }
        } else {
            res.send({ message: 'Falta Proporcionar Datos Obligatorios y/o Datos Válidos' });
        }
    } else {
        res.send({ message: 'Ocurrió un Error' });
    }
});

api.get('/salidas', function (req, res) {
    let entrada = req.body;
    let
        id_movimiento = entrada.id_movimiento || null,
        almacen = entrada.id_almacen || null,
        proveedor = entrada.id_proveedor || null,
        destino = entrada.id_destino || null,
        parte = entrada.id_parte || null,
        cantidad = entrada.cant_parte || null,
        fecha = entrada.fecha || null,
        servicio = entrada.id_servicio || null,
        contenedor = entrada.id_contenedor || null,
        candado = entrada.id_candado || null,
        secuencia = entrada.secuencia || null;
    if (entrada != null) {
        if (almacen != null && proveedor != null && destino == null && parte != null && cantidad != null && fecha != null && servicio != null && cantidad > 0) {
            if (secuencia != null) {
                let sql = `insert into movimientos_almacenes values(null,${almacen},${proveedor},${destino},${parte},${cantidad},str_to_date('${fecha}','%d/%m/%Y %T'),${servicio},'${contenedor}','${candado}','${secuencia}')`;
                con.query(sql, function (err) {
                    if (err) throw err
                    else {
                        sql = `delete from costales where secuencia='${secuencia}';`;
                        con.query(sql, function (err) {
                            if (err) throw err
                            else res.send({ message: `Costal ${secuencia} Registrado Correctamente` });
                        });
                    }
                });
            } else if (secuencia == null) {
                let sql = `insert into movimientos_almacenes values(null,${almacen},${proveedor},${destino},${parte},${cantidad},str_to_date('${fecha}','%d/%m/%Y %T'),${servicio},'${contenedor}','${candado}',null)`;
                con.query(sql, function (err) {
                    if (err) throw err
                    else {
                        sql = `update partes set existencia=existencia-${cantidad} where no_parte=${parte};`;
                        con.query(sql, function (err) {
                            if (err) throw err
                            else res.send({ message: 'Salida Registrada Correctamente' });
                        });
                    }
                });
            }
        } else {
            res.send({ message: 'Falta Proporcionar Datos Obligatorios y/o Datos Válidos' });
        }
    } else {
        res.send({ message: 'Ocurrió un Error' });
    }
});
//0 eliminar, 1 modificar
api.post('movimientos/:id/:a', function (req, res) {
    let entrada = req.body;
    let id = req.params.id;
    let a = req.params.a;
    if ((a == 0 || a == 1) && id != null) {
        let
            id_movimiento = entrada.id_movimiento || null,
            almacen = entrada.id_almacen || null,
            proveedor = entrada.id_proveedor || null,
            destino = entrada.id_destino || null,
            parte = entrada.id_parte || null,
            cantidad = entrada.cant_parte || null,
            fecha = entrada.fecha || null,
            servicio = entrada.id_servicio || null,
            contenedor = entrada.id_contenedor || null,
            candado = entrada.id_candado || null,
            secuencia = entrada.secuencia || null;
        if (entrada != null) {
            if (almacen != null && proveedor != null && destino == null && parte != null && cantidad != null && fecha != null && servicio != null && cantidad > 0) {
                if (secuencia != null) {
                    if (a == 0) {//eliminar registros de movimientos y de costales
                        let sql = `delete from movimientos where id_movimiento=${id_movimiento}`;
                        con.query(sql, function (err) {
                            if (err) throw err
                            else {
                                sql = `delete from costales where id_movimiento=${id_movimiento};`
                                con.query(sql, function (err) {
                                    if (err) throw err
                                    else {
                                        res.send({ message: 'Movimiento Eliminado Exitosamente' });
                                    }
                                });
                            }
                        });
                    } else if (a == 1) {//editar movimiento de costales y de movimientos
                        let sql = `update movimientos set id_almacén=${almacen},id_proveedor=${proveedor},id_destino=${destino},no_parte=${parte},cant_parte=${cantidad},str_to_date('${fecha}','%d/%m/%Y %T'),id_servicio=${servicio},id_contendor='${contenedor}',id_candado='${candado}',secuencia='${secuencia}')`;
                        con.query(sql, function (err) {
                            if (err) throw err
                            else {
                                sql = `update costales set secuencia=${secuencia}`;
                                con.query(sql, function (err) {
                                    if (err) throw err
                                    else
                                        res.send({ message: 'Datos Acutalizados Correctamente' });
                                });
                            }
                        });
                    }
                }
            } else {
                res.send({ message: 'Falta Proporcionar Datos Obligatorios y/o Datos Válidos' });
            }
        } else {
            res.send({ message: 'Ocurrió un Error' });
        }
    } else {
        res.send({ message: 'Ocurrió un Error' });
    }
});
module.exports = api;