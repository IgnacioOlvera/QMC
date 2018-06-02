var con = require('../conexion.js');
var express = require('express');
var api = express.Router();

api.get('/parte/:id?', function (req, res) {
    if (req.params.id) {//Si existe ID en el URL selecciona parte específica y su proveedor
        var id_parte = req.params.id;
        con.query(`select b.*, (select nombre from clientes where id_cliente=id_proveedor) from partes b where id_parte=${id_parte}`, function (err, rows) {
            if (err) throw err
            else res.send(rows);
        });
    } else {//Seleccionar todas las partes con su respectivo proveedor.
        con.query("select *, (select nombre from clientes where id_cliente=b.id_proveedor) proveedor from partes b;", function (error, rows) {
            if (error) throw error
            else res.send(rows);
        });
    }
});

api.post('/parte/:b', function (req, res) {
    let parte = req.body;
    let b = req.params.b;//Bandera para decidir si es actualización o inserción
    if (parte != null&&(b==0||b==1)) {
        let id_parte = parte.id_parte,
            no_parte = parte.no_parte,
            descripcion = parte.descripcion,
            no_parte_ext = parte.no_parte_ext,
            cant_x_caja = parte.cant_x_caja,
            cant_x_pallet = parte.cant_x_caja,
            cant_min = parte.cant_min,
            existencia = parte.existencia,
            id_proveedor = parte.id_proveedor;
        if (id_parte != null && no_parte != null && descripcion != null, existencia != null, id_proveedor != null) {
            if (b == 0)//Actualización de parte
                con.query(`update partes set id_parte=${id_parte},no_parte='${no_parte}',descripcion='${descripcion}',no_parte_ext='${no_parte_ext}',cant_x_caja=${cant_x_caja},cant_x_pallet=${cant_x_pallet},cant_min=${cant_min},existencia=${existencia},id_proveedor=${id_proveedor} where id_parte=${id_parte}`, function (err) {
                    if (err) throw err
                    else
                        res.status(200).send({ message: 'Parte editada correctamente' })
                });
            else if (b == 1)//Inserción de parte
                con.query(`insert into partes values(null,'${no_parte}','${descripcion}','${no_parte_ext}',${cant_x_caja},${cant_x_pallet},${cant_min},${existencia},${id_proveedor})`, function (err) {
                    if (err) throw err
                    else
                        res.status(200).send({ message: 'Parte insertada correctamente' })
                });
        }
    } else {
        res.send({message:'Ocurrió un error'});
    }
});
//Eliminar parte
api.delete('/parte/:id', function (req, res) {
    if (req.params.id != null) {
        let id = req.params.id
        con.query(`delete from partes where id_parte=${id}`, function (err) {
            if (err) throw err
            else
                res.status(200).send({ message: 'Parte eliminada correctamente!' })
        });

    }
});
//Seleccionar existencia de parte por unidad, caja, y tarima
api.get('/existencia/:id?', function (req, res) {
    if (req.params.id) {
        let id_parte = req.params.id
        let sql = `select no_parte,descripcion, existencia, floor(existencia/cant_x_caja) cajas, floor((existencia/cant_x_caja)/cant_x_pallet) tarimas from partes where id_parte=${id_parte};`;
        con.query(sql, function (err, rows) {
            if(err) throw err
            else res.send(rows);
        });
    } else {
        let sql =`select no_parte,descripcion, existencia, floor(existencia/cant_x_caja) cajas, floor((existencia/cant_x_caja)/cant_x_pallet) tarimas from partes`;
        con.query(sql,function(err,rows){
            if(err) throw err
            else res.send(rows);
        });
    }
});

module.exports = api;