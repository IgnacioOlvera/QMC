var con = require('../conexion.js');
var express = require('express');
var api = express.Router();
var md_auth = require('../middlewares/autenticacion.js');
var md_nivel = require('../middlewares/nivel.js');

//Regresa historial de movimientos
api.get('/movimientos', md_nivel.ensureLevel2, function (req, res) {
    let sql = `select if(id_destino is null, 'I', 'O')    class, date_format(m.fecha, '%d/%m/%Y')    fechaf, m.*, (select nombre from clientes where id_cliente = m.id_proveedor) proveedor, (select nombre from clientes where id_cliente = m.id_destino)   destino, p.no_parte, p.descripcion from movimientos_almacenes m, partes p where m.no_parte = p.no_parte order by fecha;`;
    try {
        con.query(sql, function (err, rows) {
            if (err) throw err
            else res.send(rows);
        });
    }
    catch (ex) {
        res.redirect('/error');
    }
});
api.get('/SemanalRepo', md_nivel.ensureLevel2, function (req, res) {

    let sql = `select (select count(*) from movimientos_almacenes where id_destino is not null and week(fecha) = week(m.fecha))envios, (select count(*) from movimientos_almacenes where id_destino is null and week(fecha) = week(m.fecha)) recibos, date_format(fecha, '%d/%m/%Y') FechaMov, date_format(DATE_SUB(fecha, INTERVAL DAYOFWEEK(fecha) - 1 DAY), '%d/%m/%Y') inicio, date_format(DATE_ADD(fecha, INTERVAL 7 - DAYOFWEEK(fecha) DAY), '%d/%m/%Y') final from movimientos_almacenes m group by week(fecha);`;
    try {
        con.query(sql, function (err, rows) {
            if (err) throw err
            else res.send(rows);
        });
    } catch (ex) {
        res.redirect('/error');
    }

});
api.get('/MensualRepo', md_nivel.ensureLevel2, function (req, res) {
    try {
        con.query("SET lc_time_names = 'es_ES';", function (err) {
            if (err) throw err
            else {
                let sql = `select (select count(*) from movimientos_almacenes where id_destino is not null and month(fecha) = month(m.fecha)) envios, (select count(*) from movimientos_almacenes where id_destino is null and month(fecha) = month(m.fecha))     recibos, MONTHNAME(fecha)                                                 mes from movimientos_almacenes m group by month(fecha);`
                con.query(sql, function (err, rows) {
                    if (err) throw err
                    else res.send(rows);
                });
            }
        });
    } catch (ex) {
        res.redirect('/error');
    }

});


//Movimientos dentro de fechas
api.post('/movimientosFecha', md_nivel.ensureLevel2, function (req, res) {
    let fechas = req.body;
    if (fechas.fecha_inicio && fechas.fecha_final) {
        let sql = `select id_movimiento from movimientos_almacenes where date_format(fecha,'%Y-%m-%d') between str_to_date('${fechas.fecha_inicio}', '%d/%m/%Y') and str_to_date('${fechas.fecha_final}', '%d/%m/%Y')`;
        try {
            con.query(sql, function (err, rows) {
                if (err) throw err
                else res.send(rows);
            });
        } catch (ex) {
            res.redirect('/error');
        }
    } else if (fechas.fecha) {
        let sql = `select id_movimiento from movimientos_almacenes where date_format(fecha,'%Y-%m-%d') = str_to_date('${fechas.fecha}', '%d/%m/%Y')`;
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

//Regresa historial de Entradas
api.get('/MoveEntradas', md_nivel.ensureLevel2, function (req, res) {
    let sql = `select m.*, a.nombre almacen, (select nombre from clientes where id_cliente = m.id_proveedor) proveedor, (select nombre from clientes where id_cliente = m.id_destino) destino, p.no_parte, p.descripcion from movimientos_almacenes m, almacenes a, partes p where m.id_almacen = a.id_almacen and m.no_parte = p.no_parte and m.id_destino is null order by fecha;`;
    try {
        con.query(sql, function (err, rows) {
            if (err) throw err
            else res.send(rows);
        });
    } catch (ex) {
        res.redirect('/error');
    }
});

//Regresa Historial de Salidas
api.get('/MoveSalidas', md_nivel.ensureLevel2, function (req, res) {
    let sql = `select m.*, a.nombre 1almacen, (select nombre from clientes where id_cliente = m.id_proveedor) proveedor, (select nombre from clientes where id_cliente = m.id_destino)   destino, p.no_parte, p.descripcion from movimientos_almacenes m, almacenes a, partes p where m.id_almacen = a.id_almacen and m.no_parte = p.no_parte and m.id_destino is not null order by fecha;`;
    try {
        con.query(sql, function (err, rows) {
            if (err) throw err
            else res.send(rows);
        });
    } catch (ex) {
        res.redirect('/error');
    }
});

//Registrar entrada de piezas
api.post('/entradas', md_nivel.ensureLevel2, function (req, res) {
    let f = new Date();
    cad = f.getHours() + ":" + ("0" + f.getMinutes()).slice(-2) + ":" + f.getSeconds();
    let cont = 0;
    let entrada = req.body;
    let
        proveedor = entrada.id_proveedor || null,
        parte = `'${entrada.id_parte}'` || null,
        cantidad = entrada.cant_parte || null,
        fecha = entrada.fecha || null,
        contenedor = (entrada.id_candado == "") ? null : `'${entrada.id_contenedor}'`,
        candado = (entrada.id_candado == "") ? null : `'${entrada.id_candado}'`,
        secuencia = entrada.secuencia || null,
        peso = entrada.peso || null,
        nota = entrada.id_nota || null,
        color = entrada.color || null;
    let consultas = [`insert into movimientos_almacenes values(null,1,${proveedor},null,(select no_parte from partes where id_proveedor=5),${cantidad},(select existencia from partes where id_proveedor=5),(select existencia+${cantidad} from partes where id_proveedor=5),str_to_date('${fecha} ${cad}','%d/%m/%Y %H:%i:%s'),null,${contenedor},${candado},'${secuencia}',${peso},${nota})`, `update partes set existencia=existencia+${cantidad} where no_parte=${parte};`, `insert into costales (select id_movimiento, fecha,peso,secuencia,nota, ${color} from movimientos_almacenes where secuencia is not null and secuencia='${secuencia}' and id_destino is null and id_movimiento not in(select id_movimiento from costales));`];
    if (entrada != null) {
        if (proveedor != null && parte != null && cantidad != null && nota != null && fecha != null && cantidad > 0) {
            if (secuencia != null && peso != null && nota != null && color != null && color >= 0) {
                consultas.forEach(consulta => {
                    try {
                        con.query(consulta, function (err) {
                            if (err) {
                                throw err
                                res.send({ message: `Ocurrió un error SQL`, status: "500" });
                            }
                            else {

                                cont++;
                                if (cont == 3) {
                                    res.send({ message: `Costal ${secuencia} Registrado Correctamente`, status: "200" });
                                    cont = 0
                                }
                            }
                        });
                    } catch (ex) {
                        res.redirect('/error');
                    }
                });
            } else if (secuencia == null) {
                let sql = `insert into movimientos_almacenes values(null,1,${proveedor},null,(select no_parte_ext from partes where no_parte=${parte}),${cantidad},(select existencia from partes where no_parte=${parte}),(select existencia+${cantidad} from partes where no_parte=${parte}),str_to_date('${fecha} ${cad}','%d/%m/%Y %H:%i:%s'),null,${contenedor},${candado},null,null,'${nota}')`;
                try {
                    con.query(sql, function (err) {
                        if (err) {
                            console.log(sql)
                            throw err
                            res.status(500).send({ message: 'Ocurrió un error SQL', status: "500" });
                        }
                        else {
                            sql = `update partes set existencia=existencia+${cantidad} where no_parte=${parte}`;
                            con.query(sql, function (err) {
                                if (err)
                                    res.status(500).send({ message: 'Ocurrió un error SQL' });
                                else res.status(200).send({ message: 'Entrada Registrada Correctamente', status: "200" });
                            });
                        }
                    });
                } catch (ex) {
                    res.redirect('/error');
                }
            } else {
                res.send({ message: 'Falta Proporcionar Datos Obligatorios y/o Datos Válidos', status: "500" });
            }
        } else {
            res.send({ message: 'Falta Proporcionar Datos Obligatorios y/o Datos Válidos', status: "500" });
        }
    } else {
        res.send({ message: 'Ocurrió un Error', status: "500" });
    }
});

api.post('/salidas', md_nivel.ensureLevel2, function (req, res) {
    let f = new Date();
    cad = f.getHours() + ":" + ("0" + f.getMinutes()).slice(-2) + ":" + f.getSeconds();
    let cont = 1;
    let salida = req.body;
    let
        proveedor = salida.id_proveedor || null,
        destino = salida.id_destino || null,
        parte = `'${salida.id_parte}'` || null,
        cantidad = salida.cant_parte || null,
        fecha = salida.fecha || null,
        secuencia = salida.secuencia || null,
        peso = salida.peso || null,
        nota = (salida.id_nota == "") ? `'${salida.id_nota}'` : null,
        candado = (salida.candado == "") ? null : `'${salida.candado}'`,
        contenedor = (salida.contenedor == "") ? null : `'${salida.contenedor}'`;
    consultas = [`insert into movimientos_almacenes values(null,1,${proveedor},${destino},(select no_parte from partes where id_proveedor=5),${cantidad},(select count(*) from costales),(select count(*)-${cantidad} from costales),str_to_date('${fecha} ${cad}','%d/%m/%Y %H:%i:%s'),null,null,null,'${secuencia}',${peso},${nota})`, `update partes set existencia=existencia-${cantidad} where no_parte=(select no_parte from (select no_parte from partes where id_proveedor=5) b)`, `delete from costales where secuencia='${secuencia}'`];

    if (salida != null) {
        if (proveedor != null && destino != null && parte != null && cantidad != null && fecha != null && cantidad > 0) {
            if (secuencia != null) {
                for (consulta in consultas) {
                    try {
                        con.query(consultas[consulta], function (err) {
                            if (err) {
                                throw err
                                // res.send({ message: `Ocurrió un error SQL`, status: "500" });
                            }
                            else {
                                cont++
                                if (cont == 3) {
                                    res.send({ message: `Salida de ${secuencia} Registrada Correctamente`, status: "200" });
                                    cont = 0;
                                }

                            }
                        });
                    } catch (ex) {
                        res.redirect('/error');
                    }
                }
            } else if (secuencia == null) {
                let sql = `insert into movimientos_almacenes values(null,1,${proveedor},${destino},${parte},${cantidad},(select existencia from partes where no_parte_ext=${parte}),(select existencia-${cantidad} from partes where no_parte_ext=${parte}),str_to_date('${fecha} ${cad}','%d/%m/%Y %H:%i:%s'),null,${contenedor},${candado},null,null,${nota})`;
                con.query(sql, function (err) {
                    if (err) {
                        console.log(sql);
                        throw err
                    }
                    else {
                        sql = `update partes set existencia=existencia-${cantidad} where no_parte=${parte}`;
                        try {
                            con.query(sql, function (err) {
                                if (err) res.send({ message: 'Ocurrió un error SQL', status: "500" });
                                else res.send({ message: 'Salida Registrada Correctamente', status: "200" });
                            });
                        } catch (ex) {
                            res.redirect('/error');
                        }
                    }
                });
            }
        } else {
            res.send({ message: 'Falta Proporcionar Datos Obligatorios y/o Datos Válidos', status: "500" });
        }
    } else {
        res.send({ message: 'Ocurrió un Error', status: "500" });
    }
});
//0 eliminar, 1 modificar
api.post('movimientos/:id/:a', md_nivel.ensureLevel2, function (req, res) {
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
                        try {
                            con.query(sql, function (err) {
                                if (err) res.send({ message: 'Ocurrió un Error', status: 500 });
                                else {
                                    sql = `delete from costales where id_movimiento=${id_movimiento};`
                                    con.query(sql, function (err) {
                                        if (err) res.send({ message: 'Ocurrió un Error', status: 500 });
                                        else {
                                            res.send({ message: 'Movimiento Eliminado Exitosamente' });
                                        }
                                    });
                                }
                            });
                        } catch (ex) {
                            res.redirect('/error');
                        }
                    } else if (a == 1) {//editar movimiento de costales y de movimientos
                        let sql = `update movimientos set id_almacén=${almacen},id_proveedor=${proveedor},id_destino=${destino},no_parte=${parte},cant_parte=${cantidad},str_to_date('${fecha} ${cad}','%d/%m/%Y %H:%i:%s'),id_servicio=${servicio},id_contendor='${contenedor}',id_candado='${candado}',secuencia='${secuencia}')`;
                        con.query(sql, function (err) {
                            if (err) res.send({ message: 'Ocurrió un Error', status: 500 });
                            else {
                                sql = `update costales set secuencia=${secuencia}`;
                                con.query(sql, function (err) {
                                    if (err) res.send({ message: 'Ocurrió un Error', status: 500 })
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