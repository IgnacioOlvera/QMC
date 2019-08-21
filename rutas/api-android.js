var con = require('../conexion.js');
var express = require('express');
var api = express.Router();

api.get('/api-android/getClientes/:id?', function (req, res) {
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
    }
});

api.post('/api-android/entradas', function (req, res) {
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
    let consultas = [`insert into movimientos_almacenes values(null,1,${proveedor},null,(select no_parte from partes where id_proveedor=5),${cantidad},(select existencia from partes where id_proveedor=5),(select existencia+${cantidad} from partes where id_proveedor=5),str_to_date('${fecha} ${cad}','%d/%m/%Y %H:%i:%s'),null,${contenedor},${candado},'${secuencia}',${peso},${nota})`, `update partes set existencia=existencia+${cantidad} where no_parte=${parte};`, `insert into costales (select id_movimiento, fecha, peso, secuencia, nota, ${color} from movimientos_almacenes where secuencia = '${secuencia}' and id_destino is null));`];
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
                let sql = `insert into movimientos_almacenes values(null,1,(select id_cliente from clientes where nombre = '${proveedor}' and nat = 1),null,(select no_parte_ext from partes where no_parte=${parte}),${cantidad},(select existencia from partes where no_parte=${parte}),(select existencia+${cantidad} from partes where no_parte=${parte}),str_to_date('${fecha} ${cad}','%d/%m/%Y %H:%i:%s'),null,${contenedor},${candado},null,null,'${nota}')`;
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

api.post('/api-android/salidas', function (req, res) {
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
        candado = (salida.id_candado == "") ? null : `'${salida.candado}'`,
        contenedor = (salida.id_contenedor == "") ? null : `'${salida.contenedor}'`;
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
                let sql = `insert into movimientos_almacenes values(null,1,(select id_cliente from clientes where nombre = '${proveedor}' and nat = 1),(select id_cliente from clientes where nombre = '${destino}' and nat = 0),${parte},${cantidad},(select existencia from partes where no_parte_ext=${parte}),(select existencia-${cantidad} from partes where no_parte_ext=${parte}),str_to_date('${fecha} ${cad}','%d/%m/%Y %H:%i:%s'),null,${contenedor},${candado},null,null,${nota})`;
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
                            res.send({ message: 'Ocurrió un error SQL', status: "500" });
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

api.post('/api-android/parte', function (req, res) {
    let parte = req.body;
    let b = 1//Bandera para decidir si es actualización o inserción
    if (parte != null && (b == 0 || b == 1)) {
        let id_parte = parte.id_parte || null,
            no_parte = parte.no_parte || null,
            descripcion = parte.descripcion || null,
            no_parte_ext = (parte.no_parte_ext == "") ? null : `'${parte.no_parte_ext}'`,
            cant_x_caja = parte.cant_x_caja || null,
            cant_x_pallet = parte.cant_x_pallet || null,
            cant_min = parte.cant_min || null,
            existencia = parte.existencia || null,
            id_proveedor = parte.id_proveedor || null,
            peso = parte.peso || 0,
            estado = parte.estado,
            proyecto = parte.id_proyecto,
            pnrecio = parte.precio;
        if (no_parte != null && descripcion != null, existencia != null && id_proveedor != 0) {
            try {
                if (b == 0)//Actualización de parte
                    con.query(`update partes set precio=${precio},no_parte='${no_parte}',descripcion='${descripcion}',no_parte_ext=${no_parte_ext},cant_x_caja=${cant_x_caja},cant_x_pallet=${cant_x_pallet},cant_min=${cant_min},existencia=${existencia},id_proyecto=${proyecto},peso=${peso},estado=${estado} where no_parte='${no_parte}'`, function (err) {
                        if (err) res.send({ message: 'Ocurrió un error', status: "500" });
                        else
                            res.status(200).send({ message: 'Parte editada correctamente', status: "200" })
                    });
                else if (b == 1)//Inserción de parte
                    con.query(`insert into partes values(null,'${no_parte}','${descripcion}',${no_parte_ext},${cant_x_caja},${cant_x_pallet},${cant_min},${existencia},(select id_cliente from clientes where nombre = '${id_proveedor}'),0,0,(select id_proyecto from proyectos where nombre = '${proyecto}'),0,0,0,0,0)`, function (err) {
                        if (err) console.log(err)
                        else
                            res.status(200).send({ message: 'Parte insertada correctamente', status: "200" })
                    });
            } catch (ex) {
                res.redirect('/error');
            }
        } else {
            res.send({ message: 'Falta Proporcionar Datos Obligatorios y/o Válidos', status: "500" });
        }
    } else {
        res.send({ message: 'Ocurrió un error', status: "500" });
    }
});

api.get('/api-android/proyectos', function (req, res) {
    try {
        con.query('select * from proyectos', function (err, rows) {
            if (err) throw err
            else res.send(rows);
        });
    } catch (ex) {
        res.send({ message: 'Error al obtener los proyectos' });
    }
});

module.exports = api;