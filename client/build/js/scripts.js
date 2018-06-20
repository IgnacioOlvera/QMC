//Función para incializar en la sección de recibo
async function initRecibo() {
    let fifoColorsTNET = ['C00000', 'FF0000', 'FFC000', 'FFFF00', '92D050', '00B050', '00B0F0', '0070C0', '002060', '7030A0'];//Colores FIFO de TNET
    $('#color').on('change', function () {
        let color = $(this).val();
        $(this).css('background-color', "#" + fifoColorsTNET[color]);
    });

    let count = 1;//Contador para los costales
    let t = $('#piezasRecibo').DataTable({//Inicializar tabla de clientes.
        "ordering": false
    });
    let tnet = $('#piezasTNET').DataTable({//Inicializar tabla de tnenet
        "ordering": false
    });
    let pet = await fetch('http://localhost:3000/clienteNat/0');//petición para llenar combo de clientes proveedores
    let clientes = await pet.json();
    $('#in_cliente').append('<option selected value="0"> Sección de cliente...</option>')
    clientes.forEach(cliente => {//Llenado de select con todos lo clientes
        $('#in_cliente').append(`<option value='${cliente.id_cliente}'>${cliente.nombre}</option>`);
    });
    $('#agregarCostal').on('click', function () {//Función del botón para agregar un costal más a la lista
        let fecha = $('#fecha_recibo').val();
        fecha = fecha.split("/");//Dividir la fecha por /
        let cod = ("0" + fecha[0]).slice(-2) + ("0" + fecha[1]).slice(-2) + fecha[2].substr(-2) + "-" + ("0" + count).substr(-2);//Código de serial de costales.
        tnet.row.add([count, '<input id="peso" type=number name="peso" class="form-control peso" placeholder="Peso en KG"/>', `<input id="serial" name="serial" class='form-control serial' type='text' value='${cod}'>`]).draw(false);//Agregar fila a la tbla de tnet
        count++;

    });

    $("#fecha_recibo").daterangepicker({ //Configuración del datepicker
        singleDatePicker: !0,
        singleClasses: "picker_4",
        locale: {
            format: 'DD/MM/YYYY'
        }
    }, function (a, b, c) {
        //console.log(a.toISOString(), b.toISOString(), c)
    });

    $('#in_cliente').on('change', async function () {//Evento del select de cliente
        if ($(this).val() == 4) {//Si el valor es 4, se muestra la tabla de tnet
            $('#piezas').hide('oculto');//oculta la tabla de los clientes normales
            $('#tablaTNET').show('oculto');//muestra la tabla de tnet
        } else {
            $('#piezas').show('oculto');//mostrar la tabla de clientes normales
            $('#tablaTNET').hide('oculto');//ocultar la tabla de tnet
            let pet = await fetch('http://localhost:3000/proveedor/' + $(this).val());//Petición para traer todas las piezas que surte un proveedor
            let partes = await pet.json();
            t.rows().remove().draw();//Quitar todos los elementos de la tabla.
            partes.forEach(parte => {//Agregar las filas con cada parte de cada proveedor a la tabla.
                t.row.add([parte.interior, parte.exterior, parte.descripcion, `<input type="number" min="0" data-validation="number" data-caja="${parte.caja}" data-pallet="${parte.pallet}" id="cant" name="cant_parte" class="form-control cantidad"/>`, `<label class="cajas">0</label>`, `<label class="pallets">0</label>`]).draw();
            });
            $('.cantidad').on('keyup', function () {//Evento del input de cantidad para los labels de tarimas y cajas
                let cantidad = $(this).val();//Obtener cantidad del input
                let cant_caja = $(this).data("caja");//Obtener atributo data-caja del input
                let cant_pallet = $(this).data("pallet");//Obtener el atributo data-pallet del input
                let caja = $(this).parent().siblings('td').children(".cajas");//Navegar y obtener el objeto con clase caja dentro del td hermano del td que alberga este input
                let pallet = $(this).parent().siblings('td').children(".pallets");//Navegar y obtener el objeto con clase pallet dentro del td hermano del td que alberga este input
                let tot_cajas = Math.floor(cantidad / cant_caja);//cálculo de las cajas que se recibirán según la cantidad ingresada
                let tot_pallets = Math.floor(tot_cajas / cant_pallet);//Cálculo de los pallets que se ingresarán según las cajas.
                caja.text(tot_cajas);//setear cáculo  de cajas
                pallet.text(tot_pallets);//setear cálculo de pallets
            });
        }
    });
    $('#limpiarReciboCostales').click(function () {//Evento para limpar toda la tabla de costales ingresados
        tnet.rows().remove().draw();
        count = 1;
    });
    $('#terminarRecibo').on('click', async function () {//Enviar todas las filas para realzar movimientos en la base de datos.
        let cantidades = t.$('.cantidad').serialize();//Obtener una cadena con todos los valores de los inputs de cantidades.
        cantidades = cantidades.replace(/cant_parte=/gi, "").split("&");//Quitar de la cadena cant_parte y separarlos por &
        t.rows().every(async function (rowIdx, tableLoop, rowLoop) { //loop para recorrer toda la tabla
            if (cantidades[rowIdx] > 0) {//Si la cantidad es mayor a 0
                let a = $("#form1").serializeObject();//convertir los elementos del form en un objeto json.
                let data = this.data();//data de la fila
                a.id_parte = data[0];//obtener la primera celda la fila y setearlo en el objeto json del form
                a.cant_parte = cantidades[rowIdx];////obtener la celda de cantidades de la fila y setearlo en el objeto json del form
                a = JSON.stringify(a);//Convertir a cadena el json
                let options = {//opciones para la petición
                    method: 'POST',
                    body: a,
                    headers: { "Content-Type": "application/json" }
                }
                let c = await fetch('http://localhost:3000/entradas', options);//petición
                let res = await c.json();
                t.$('.cantidad').val("");//regresar las cantidades a sus valores iniciales
                t.$('label').text('0');//regresar las cantidades a sus valores iniciales
                if (res.status == 200) {
                    $.notify(res.message, "success");//mensaje del backend
                } else {
                    $.notify(res.message);
                }
            }
        });
    });

    $('#terminarReciboCostales').on('click', function () {//Evento para terminar los recibos de contales
        let pesos = tnet.$('.peso').serialize().replace(/peso=/gi, "").split("&");//obtener los pesos de los costales.
        let seriales = tnet.$('.serial').serialize().replace(/serial=/gi, "").split("&");//obenter los seriales de los costales
        tnet.rows().every(async function (rowIdx, tableLoop, rowLoop) {
            let a = $("#form1").serializeObject();//Convertir a json los objetos de la forma
            let color = $('#color').val();//Obtener la información de la línea recorrida
            a.secuencia = seriales[rowIdx];//setear en el json la secuencia del costal
            a.id_parte = "5";//setear el número de parte en este caso el 5 es simplemente un costal.
            a.peso = pesos[rowIdx]//setear peso en el json la secuencia del costal
            a.cant_parte = 1;//setear la cantidad de partes
            a.color = color;
            a = JSON.stringify(a);//convertir en string  el objeto json para pasarlo al bakend
            let options = {//opciones de la petición
                method: 'POST',
                body: a,
                headers: { "Content-Type": "application/json" }
            }
            let c = await fetch('http://localhost:3000/entradas', options);//petición
            let res = await c.json();
            tnet.rows().remove().draw();
            if (res.status == 200) {
                $.notify(res.message, "success");//mensaje del backend
            } else {
                $.notify(res.message);
                count = 1;
            }

        });
    });
}
async function initEnvios() {
    let fifoColors = ['BCABA0', 'ADCC78', '16991F', '569900', 'B11B07', 'FF0008', 'E00F47', 'CE5668', 'C47B97', 'CC7695', '522445', '4A5071'];//Colores FIFO de QMC
    let fifoColorsTNET = ['C00000', 'FF0000', 'FFC000', 'FFFF00', '92D050', '00B050', '00B0F0', '0070C0', '002060', '7030A0'];//Colores FIFO de TNET
    let count = 1;
    let t = $('#piezasRecibo').DataTable({//Inicializar tabla de clientes.
        "ordering": false
    });
    let tnet = $('#piezasTNET').DataTable({//Inicializar tabla de tnenet
        "ordering": false
    });

    let pet = await fetch('http://localhost:3000/clienteNat/0');
    let clientes = await pet.json();
    $('#in_cliente').append('<option selected value="0"> Sección de cliente...</option>')
    clientes.forEach(cliente => {
        $('#in_cliente').append(`<option value='${cliente.id_cliente}'>${cliente.nombre}</option>`);
    });
    let url = `http://localhost:3000/clienteNat/1`
    pet = await fetch(url)
    clientes = await pet.json();
    $('#in_clienteDest').append('<option selected value="0"> Sección de cliente...</option>')
    clientes.forEach(cliente => {
        $('#in_clienteDest').append(`<option value='${cliente.id_cliente}'>${cliente.nombre}</option>`);
    });
    $("#fecha_recibo").daterangepicker({
        singleDatePicker: !0,
        singleClasses: "picker_4",
        locale: {
            format: 'DD/MM/YYYY'
        }
    }, function (a, b, c) {
        //console.log(a.toISOString(), b.toISOString(), c)
    });
    url = "httP://localhost:3000/costales";
    pet = await fetch(url);
    let costales = await pet.json();

    costales.forEach(costal => {
        color = costal.color;
        tnet.row.add(['<input type="checkbox" id="check-all" class="flat">', `<label id="scotal" name="secuencia">${costal.secuencia}</label>`, `<label id="pcostal" name="peso">${costal.peso}</label>`, `<div class="col-md-1" style="width: 100px; height: 40px; background-color:#${fifoColorsTNET[color]}"> </div>`, `<label id="ncostal" name="nota">${costal.nota}</label>`]).draw();
    });
    tnet.$('input[type="checkbox"]').iCheck({
        checkboxClass: 'icheckbox_flat-red'
    });

    $('#in_cliente').on('change', async function () {
        if ($(this).val() == 4) {//Si el valor es 4, se muestra la tabla de tnet
            $('#piezas').hide('oculto');//oculta la tabla de los clientes normales
            $('#tablaTNET').show('oculto');//muestra la tabla de tnet
        } else {
            $('#piezas').show('oculto');//mostrar la tabla de clientes normales
            $('#tablaTNET').hide('oculto');//ocultar la tabla de tnet
            let pet = await fetch('http://localhost:3000/proveedor/' + $(this).val());//Petición para traer todas las piezas que surte un proveedor
            let partes = await pet.json();
            t.rows().remove().draw();//Quitar todos los elementos de la tabla.
            partes.forEach(parte => {//Agregar las filas con cada parte de cada proveedor a la tabla.
                t.row.add([parte.interior, parte.exterior, parte.descripcion, `<input type="text" data-validation="number" data-caja="${parte.caja}" data-pallet="${parte.pallet}" id="cant" name="cant_parte" class="form-control cantidad"/>`, `<label class="cajas">0</label>`, `<label class="pallets">0</label>`]).draw();
            });
            $('.cantidad').on('keyup', function () {//Evento del input de cantidad para los labels de tarimas y cajas
                let cantidad = $(this).val();//Obtener cantidad del input
                let cant_caja = $(this).data("caja");//Obtener atributo data-caja del input
                let cant_pallet = $(this).data("pallet");//Obtener el atributo data-pallet del input
                let caja = $(this).parent().siblings('td').children(".cajas");//Navegar y obtener el objeto con clase caja dentro del td hermano del td que alberga este input
                let pallet = $(this).parent().siblings('td').children(".pallets");//Navegar y obtener el objeto con clase pallet dentro del td hermano del td que alberga este input
                let tot_cajas = Math.floor(cantidad / cant_caja);//cálculo de las cajas que se recibirán según la cantidad ingresada
                let tot_pallets = Math.floor(tot_cajas / cant_pallet);//Cálculo de los pallets que se ingresarán según las cajas.
                caja.text(tot_cajas);//setear cáculo  de cajas
                pallet.text(tot_pallets);//setear cálculo de pallets
            });
        }
    });

    $('#limpiarReciboCostales').click(function () {//Evento para limpar toda la tabla de costales ingresados
        tnet.rows().remove().draw();
        count = 0;
    });

    $('#terminarRecibo').on('click', async function () {//Enviar todas las filas para realzar movimientos en la base de datos.
        let cantidades = t.$('.cantidad').serialize();//Obtener una cadena con todos los valores de los inputs de cantidades.
        let destino = $('#in_clienteDest').val();
        cantidades = cantidades.replace(/cant_parte=/gi, "").split("&");//Quitar de la cadena cant_parte y separarlos por &
        t.rows().every(async function (rowIdx, tableLoop, rowLoop) { //loop para recorrer toda la tabla
            if (cantidades[rowIdx] > 0) {//Si la cantidad es mayor a 0
                let a = $("#form1").serializeObject();//convertir los elementos del form en un objeto json.
                let data = this.data();//data de la fila
                a.id_parte = data[0];//obtener la primera celda la fila y setearlo en el objeto json del form
                a.cant_parte = cantidades[rowIdx];////obtener la celda de cantidades de la fila y setearlo en el objeto json del form
                a.id_destino = destino;
                a = JSON.stringify(a);//Convertir a cadena el json
                let options = {//opciones para la petición
                    method: 'POST',
                    body: a,
                    headers: { "Content-Type": "application/json" }
                }
                let c = await fetch('http://localhost:3000/salidas', options);//petición
                let res = await c.json();
                t.$('.cantidad').val("");//regresar las cantidades a sus valores iniciales
                t.$('label').text('0');//regresar las cantidades a sus valores iniciales
                if (destino == 0 || a.id_proveedor == 0) {
                    $.notify("Falta llenar campos obligatorios  (*)");
                } else {
                    if (res.status == 200) {
                        $.notify(res.message, "success");//mensaje del backend
                        count = 0;
                    } else {
                        $.notify(res.message);
                        count = 0;
                    }
                }
            }
        });
    });

    $('#terminarReciboCostales').on('click', function () {//Evento para terminar los recibos de contales
        $('#piezasTNET > tbody  > tr > td > .checked').each(async function () {
            let a = $("#form1").serializeObject();//Convertir a json los objetos de la forma
            if (a.id_destino != 0 && a.id_cliente != 0 && a.fecha != 0) {
                var datos = [];
                var row = tnet.row($(this).parents('tr'));
                row.remove().draw();
                $($($(this).parent().siblings().children('label'))).each(function () {
                    datos.push($(this).text());
                });
                a.secuencia = datos[0];//setear en el json la secuencia del costal
                a.id_parte = "5";//setear el número de parte en este caso el 5 es simplemente un costal.
                a.peso = datos[1]//setear peso en el json la secuencia del costal
                a.cant_parte = "1";//setear la cantidad de partes
                a.nota = datos[2];
                a = JSON.stringify(a);//convertir en string  el objeto json para pasarlo al bakend
                let options = {//opciones de la petición
                    method: 'POST',
                    body: a,
                    headers: { "Content-Type": "application/json" }
                }
                let c = await fetch('http://localhost:3000/salidas', options);//petición
                let res = await c.json();
                if (res.status == 200) {
                    $.notify(res.message, "success");//mensaje del backend
                    cont = 0;
                } else {
                    $.notify(res.message);
                }
            } else {
                $.notify("Falta Proporcionar Datos Obligatorios (*)");
                cont = 0;
            }
        });
    });
}
async function initPartes() {
    let fifoColorsTNET = ['C00000', 'FF0000', 'FFC000', 'FFFF00', '92D050', '00B050', '00B0F0', '0070C0', '002060', '7030A0'];//Colores FIFO 
    let modales = "";
    let t = $('#piezasRecibo').DataTable({//Inicializar tabla de clientes.
        "ordering": false,
        "createdRow": function (row, data) {
            $(row).attr("data-prove", data[0]);
            let min = data[3];
            let existencia = data[4];
            (min > existencia) ? setInterval(function () {
                $(row).css({
                    "color": "black", "background-color": function () {
                        this.switch = !this.switch
                        return this.switch ? "#d51f2e9c" : "#fff"
                    }, 'font-weight': 'bold'
                });
            }, 700) : "";

        }, "columnDefs": [
            {
                "targets": [0],
                "visible": false
            }
        ], "bPaginate": false
    });
    let tnet = $('#piezasTNET').DataTable({//Inicializar tabla de tnenet
        "ordering": false,
        "createdRow": function (row, data, index) {
            $('td', row).eq(4).css('background-color', "#" + fifoColorsTNET[data[4]]).html("");
        }
    });
    let pet = await fetch('http://localhost:3000/clienteNat/0');
    let clientes = await pet.json();
    $('#in_cliente').append('<option selected value="0"> Sección de cliente...</option>')
    clientes.forEach(cliente => {
        $('#in_cliente').append(`<option value='${cliente.id_cliente}'>${cliente.nombre}</option>`);
    });
    pet = await fetch("http://localhost:3000/costales");

    let costales = await pet.json();
    let tnetmodals = "";
    costales.forEach(costal => {
        let fecha = costal.fecha.split("T")[0];
        let color = costal.color;
        console.log(color);
        tnetmodals += `<div style="display:none" id="modal-${costal.secuencia}" class="modal fade modal-costales in" tabindex="-1" role="dialog" aria-hidden="true" style="display: block; padding-right: 15px;"> <div class="modal-dialog modal-lg"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal"> <span aria-hidden="true">×</span> </button> <h4 class="modal-title" id="myModalLabel">Costal ${costal.secuencia}</h4> </div> <div class="modal-body"> <form id="Costal-${costal.secuencia}-Details" class="form-horizontal form-label-left"> <div class="col-md-12"> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Secuencia <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="text" value="${costal.secuencia}" name="secuencia" id="in_secuencia-${costal.secuencia}" class="form-control col-md-7 col-xs-12" placeholder="Ingresar Secuencia" /> </div> </div> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Peso <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="number" min="0" name="peso" value="${costal.peso}" id="in_peso-${costal.secuencia}" class="form-control col-md-7 col-xs-12" placeholder="Peso"/></div></div> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Identificador FIFO <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <select class="form-control" data-color="${costal.color}"  id="color-${costal.secuencia}" name="color" style="background-color:#${fifoColorsTNET[color]}"><option hidden selected value="${color}"></option><option value="0" style="background-color:#C00000">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </option> <option value="1" style="background-color:#FF0000">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </option> <option value="2" style="background-color:#FFC000">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </option> <option value="3" style="background-color:#FFFF00">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </option> <option value="4" style="background-color:#92D050">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </option> <option value="5" style="background-color:#00B050">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </option> <option value="6" style="background-color:#00B0F0">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </option> <option value="7" style="background-color:#0070C0">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </option> <option value="8" style="background-color:#002060">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </option> <option value="9" style="background-color:#7030A0">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </option> </select> </div> </div> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Nota <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="number" min="0" value="${costal.nota}" name="nota" id="in_nota-${costal.secuencia}" class="form-control col-md-7 col-xs-12" placeholder="N° de Nota" /> </div> </div> </div> </form> </div> <div class="modal-footer"> <button type="button" data-target=${costal.secuencia} class="btn btn-primary actualizarCostal">Guardar Cambios</button> </div> </div> </div> </div>`;
        tnet.row.add([costal.nota, fecha, costal.peso, costal.secuencia, costal.color, `<button type="button" class="btn btn-primary editarc" data-toggle="modal" data-parte=${costal.secuencia} data-target="#modal-${costal.secuencia}">Editar <span class="fa fa-edit"></span></button>`]).draw();

    });

    $('#tnetModals').html(tnetmodals);

    $('.modal-costales').find('select').on('change', function () {
        let color = $(this).val();
        $(this).css({ 'background-color': `#${fifoColorsTNET[color]}` });
    });

    $('.actualizarCostal').on('click', async function () {
        let f = $(`#Costal-${$(this).data("target")}-Details`);
        let form = f.serializeObject();
        let row = $($('#piezasTNET').find(`[data-parte="${$(this).data("target")}"]`)).parents('tr');
        let options = {
            method: 'post',
            body: JSON.stringify(form),
            headers: { "Content-Type": "application/json" }
        }
        let url = "http://localhost:3000/costales";
        let pet = await fetch(url, options);
        let r = await pet.json();
        if (r.status == 500) {
            $.notify(r.message);
        }
        else if (r.status == 200) {
            $.notify(r.message, 'success');
            tnet.cell(row, 0).data(form.nota);
            tnet.cell(row, 2).data(form.peso);
            tnet.cell(row, 3).data(form.secuencia);
            $('td', row).eq(4).css('background-color', "#" + fifoColorsTNET[form.color]);
            $(`#modal-${$(this).data("target")}`).modal('toggle');
        }
    });

    let bandera = true;
    $('#in_cliente').on('change', async function () {
        if (bandera == true) {
            let pet = await fetch('http://localhost:3000/proveedor');//Petición para traer todas las piezas que surte un proveedor
            let partes = await pet.json();
            partes.forEach(parte => {
                (parte.exterior == null) ? parte.exterior = "" : parte.exterior;
                modales += `<div style="display:none" id="modal-${parte.interior}" class="modal fade  in" tabindex="-1" role="dialog" aria-hidden="true" style="display: block; padding-right: 15px;"> <div class="modal-dialog modal-lg"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal"> <span aria-hidden="true">×</span> </button> <h4 class="modal-title" id="myModalLabel">${parte.descripcion} - ${parte.interior}</h4> </div> <div class="modal-body"> <form id="Parte-${parte.interior}-Details" class="form-horizontal form-label-left"> <div class="col-md-12"> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> N° de Parte <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="text" value="${parte.interior}" name="no_parte" id="in_no_parte-${parte.interior}" class="form-control col-md-7 col-xs-12" placeholder="Ingresar Número de Parte" /> </div> </div> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> N° de Parte Exterior </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="text" value="${parte.exterior}" name="no_parte_ext" id="in_no_parte_ext-${parte.exterior}" class="form-control col-md-7 col-xs-12" placeholder="Ingresar Número de Parte Exterior En Caso de Existir" /> </div> </div> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Descripción <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="text" name="descripcion" value="${parte.descripcion}" id="in_decripcion-${parte.interior}" class="form-control col-md-7 col-xs-12" placeholder="Descripción" /> </div> </div> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Cantidad X Caja <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="number" min="0" value="${parte.caja}" name="cant_x_caja" id="in_cantxcaja-${parte.interior}" class="form-control col-md-7 col-xs-12" placeholder="Cantidad por Caja" /> </div> </div> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Cantidad X Pallet <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="number" value="${parte.pallet}" min="0" name="cant_x_pallet" id="in_cantxpallet-${parte.interior}" class="form-control col-md-7 col-xs-12" placeholder="Cantidad por Pallet" /> </div> </div> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Cantidad X Mínima <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="number" value="${parte.cant_min}" min="0" name="cant_min" id="in_cant_min-${parte.interior}" class="form-control col-md-7 col-xs-12" placeholder="Cantidad Mínima" /> </div> </div> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Existencia <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="number" min="0" value="${parte.existencia}" name="existencia" id="in_existencia-${parte.interior}" class="form-control col-md-7 col-xs-12" placeholder="Cantidad Mínima" /> </div> </div> </div> </form></div> <div class="modal-footer"> <button type="button" data-target="${parte.interior}" data-parte="${parte.interior}" class="btn btn-primary actualizarParte">Guardar Cambios</button></div> </div> </div> </div>`;
                let cajas = Math.floor(parte.existencia / parte.caja);
                let tarimas = Math.floor(cajas / parte.pallet);
                t.row.add([parte.id_proveedor, parte.interior, parte.exterior, parte.descripcion, parte.cant_min, parte.existencia, cajas, tarimas, `<button type="button" class="btn btn-primary editar" data-toggle="modal" title="Editar" data-parte=${parte.interior} data-target="#modal-${parte.interior}"><span class="fa fa-edit"></span></button><button data-target="${parte.interior}" type="button" title="Eliminar" class="btn btn-danger eliminar"><span class="fa fa-times"></span></button>`]).draw().node();
            });
            t.draw();
            bandera = !bandera;
        }
        if ($(this).val() == 4) {//Si el valor es 4, se muestra la tabla de tnet
            $('#piezas').hide('oculto');//oculta la tabla de los clientes normales
            $('#tablaTNET').show('oculto');//muestra la tabla de tnet
        } else {
            $('#piezas').show('oculto');//mostrar la tabla de clientes normales
            $('#tablaTNET').hide('oculto');//ocultar la tabla de tnet
            $('#piezasRecibo tbody').find('tr').hide();
            let rows = $(`[data-prove=${$(this).val()}]`)
            rows.show();
            $('#modals').html(modales);
            $('.proveedores').html($('#in_cliente').html());
            $('.eliminar').on('click', async function () {
                let parte = $(this).data("target");
                let options = {
                    method: 'delete',
                    headers: { "Content-Type": "application/json" }
                }
                let pet = await fetch(`http://localhost:3000/parte/${parte}`, options);
                let res = await pet.json();

                if (res.status == 500)
                    $.notify(res.message);
                else if (res.status == 200) {
                    $.notify(res.message, 'success');
                    t.row($(this).parents('tr')).remove().draw();
                }
            });

            $('.actualizarParte').on('click', async function () {
                let form = $(`#Parte-${$(this).data("target")}-Details`).serializeObject();
                let row = t.row($($($('#piezas').find(`[data-parte="${$(this).data("target")}"]`)).parents('tr')));
                let cajas = Math.floor(form.existencia / form.cant_x_caja);
                let tarimas = Math.floor(cajas / form.cant_x_pallet);
                let options = {
                    method: 'post',
                    body: JSON.stringify(form),
                    headers: { "Content-Type": "application/json" }
                }
                let pet = await fetch('http://localhost:3000/parte/0', options);
                let res = await pet.json();
                if (res.status == 500) {
                    $.notify(res.message);
                } else if (res.status == 200) {
                    $.notify(res.message, 'success');
                    t.cell(row, 1).data(form.interior);
                    t.cell(row, 2).data(form.no_parte_ext);
                    t.cell(row, 3).data(form.descripcion);
                    t.cell(row, 4).data(form.cant_min);
                    t.cell(row, 5).data(form.existencia);
                    t.cell(row, 6).data(cajas);
                    t.cell(row, 7).data(tarimas);
                    $(`#modal-${$(this).data("target")}`).modal('toggle');
                }
            });
        }

    });
    $('#in_provee').html($('#in_cliente').html());
    $('#limpiarRegistro').on('click', function () {
        $('#RegistrarParteForm')[0].reset();
    });
    $('#registroParte').on('click', async function () {
        let form = $('#RegistrarParteForm').serializeObject();
        form = JSON.stringify(form);
        if (form != null) {
            let options = {
                method: 'post',
                body: form,
                headers: { "Content-Type": "application/json" }
            }
            let url = "http://localhost:3000/parte/1"
            let pet = await fetch(url, options);
            let res = await pet.json();

            if (res.status == "200") {
                $.notify("Parte Registrada Correctamente", "success");
                $('#AgregarParteModal').modal('toggle');
            } else if (res.status == "500") {
                $.notify("Falta Proporcionar Datos Obligatorios y/o Válidos");
            }
        } else {
            $.notify("Falta Proporcionar Datos Obligatorios y/o Válidos");
        }
    });
}
async function initClientes() {
    let TablaClientes = $('#ClientesInfo').DataTable();
    let url = "http://localhost:3000/cliente";
    let pet = await fetch(url);
    let clientes = await pet.json();
    let modales = "", nat = ['Proveedor', 'Cliente'];
    clientes.forEach(cliente => {
        modales += `<div style="display:none" id="modal-${cliente.id_cliente}" class="modal fade modal-costales in" tabindex="-1" role="dialog" aria-hidden="true" style="display: block; padding-right: 15px;"> <div class="modal-dialog modal-lg"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal"> <span aria-hidden="true">×</span> </button> <h4 class="modal-title" id="myModalLabel">${cliente.nombre}</h4> </div> <div class="modal-body"> <form id="${cliente.id_cliente}-Info" class="form-horizontal form-label-left"> <div class="col-md-12"> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Nombre del cliente <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="text" value="${cliente.nombre}" name="nombre" id="cliente_nombre_${cliente.id_cliente}" class="form-control col-md-7 col-xs-12" placeholder="Nombre del Cliente" /> </div> </div> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Dirección </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="text" value='${cliente.direccion}' name="direccion" id="cliente_direccion_${cliente.id_cliente}" class="form-control col-md-7 col-xs-12" placeholder="Dirección del Cliente" /> </div> </div> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> RFC <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="text" value=${cliente.RFC} name="rfc" id="cliente_rfc_${cliente.id_cliente}" class="form-control col-md-7 col-xs-12" placeholder="RFC" /> </div> </div> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Tipo de Cliente <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <select class="form-control col-md-7 col-xs-12" name="nat" id="nat_${cliente.id_cliente}" data-val="${cliente.nat}"> <option value="${cliente.nat}" disabled selected>Proveedor/Cliente</option> <option value="0">Proveedor</option> <option value="1">Cliente</option> </select> </div> </div> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Estado <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <select class="form-control col-md-7 col-xs-12" name="estado" data-val="${cliente.estado}" id="estado_${cliente.id_cliente}"> <option value="${cliente.estado}" disabled selected >Activo/Inactivo</option> <option value="ACTIVO">Activo</option> <option value="INACTIVO">Inactivo</option> </select> </div> </div> </div> </form> </div> <div class="modal-footer"> <button type="button" data-target=${cliente.id_cliente} class="btn btn-primary actualizarCliente">Guardar Cambios</button> </div> </div> </div> </div>`;

        TablaClientes.row.add([cliente.nombre, cliente.direccion, cliente.RFC, cliente.estado, nat[cliente.nat], `<button type="button" class="btn btn-primary editar" data-toggle="modal" title="Editar" data-client=${cliente.id_cliente} data-target="#modal-${cliente.id_cliente}"><span class="fa fa-edit"></span></button><button data-target="${cliente.id_cliente}" type="button" title="Eliminar" class="btn btn-danger eliminar"><span class="fa fa-times"></span></button>`]);
    });
    $('#ModalesClientes').html(modales);
    TablaClientes.draw();

    $('.actualizarCliente').on('click', async function () {
        let form = $(`#${$(this).data("target")}-Info`).serializeObject();
        let row = TablaClientes.row($($($('#ClientesInfo').find(`[data-client="${$(this).data("target")}"]`)).parents('tr')));
        form.id_cliente = $(this).data("target");
        form.nat = $(`#nat_${$(this).data("target")}`).val() || $(`#nat_${$(this).data("target")}`).data("val");
        form.estado = $('#estado_' + $(this).data("target")).val() || $('#estado_' + $(this).data("target")).data("val");
        console.log(form)
        let url = "http://localhost:3000/cliente/0";
        let options = {
            method: 'post',
            body: JSON.stringify(form),
            headers: { "Content-Type": "application/json" }
        }
        let pet = await fetch(url, options);
        let res = await pet.json();
        if (res.status == "200") {
            $.notify(res.message, "success");
            $(`#modal-${$(this).data("target")}`).modal("toggle");
            TablaClientes.cell(row, 0).data(form.nombre);
            TablaClientes.cell(row, 1).data(form.direccion);
            TablaClientes.cell(row, 2).data(form.rfc);
            TablaClientes.cell(row, 3).data(form.estado)
            TablaClientes.cell(row, 4).data(nat[form.nat]);
        } else if (res.status == "500") {
            $.notify(res.message);
        }
    });
    $('.eliminar').on('click', async function () {
        let cliente = $(this).data("target");
        let url = "http://localhost:3000/cliente/" + cliente;
        let options = {
            method: 'delete',
            headers: { "Content-Type": "application/json" }
        }
        let pet = await fetch(url, options);
        let res = await pet.json();
        if (res.status == "200") {
            $.notify(res.message, "success");
            TablaClientes.row($(this).parents('tr')).remove().draw();
        } else if (res.status == "500") {
            $.notify(res.message);
        }


    });
    $('#registroCliente').on('click', async function () {
        let form = $('#RegistrarClienteForm').serializeObject();
        console.log(form);
        let url = "http://localhost:3000/cliente/1";
        let options = {
            method: 'post',
            body: JSON.stringify(form),
            headers: { "Content-Type": "application/json" }
        }
        let pet = await fetch(url, options);
        let res = await pet.json();
        if (res.status == "200") {
            $.notify(res.message, "success");
        } else if (res.status == "500") {
            $.notify(res.message);
        }

    });

}
async function initMovimientos() {
    let mov = $('#MovimientosInfo').DataTable({
        "createdRow": function (row, data) {
            let info = JSON.parse(data[0]);
            console.log(info);
            $(row).attr("data-clasificacion", info.clasificacion);
        }, "columnDefs": [
            {
                "targets": [0],
                "visible": false
            }
        ]
    });
    let url = "http://localhost:3000/movimientos"
    let pet = await fetch(url);
    let movimientos = await pet.json();
    let modales = "";
    movimientos.forEach(movimiento => {
        let fecha = movimiento.fecha.split("T")[0];
        modales += `<div style="display:none" id="modal-${movimiento.id_movimiento}" class="modal fade modal-costales in" tabindex="-1" role="dialog" aria-hidden="true" style="display: block; padding-right: 15px;"> <div class="modal-dialog modal-lg"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal"> <span aria-hidden="true">×</span> </button> <h4 class="modal-title" id="myModalLabel">Movimiento ${movimiento.id_movimiento} del ${movimiento.fecha}</h4> </div> <div class="modal-body"> <form id="${movimiento.id_movimiento}-Info" class="form-horizontal form-label-left"> <div class="col-md-12"> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Origen <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="text" value="${movimiento.proveedor}" data-prove="${movimiento.id_proveedor}" name="origen" id="${movimiento.id_movimiento}-proveedor" class="form-control col-md-7 col-xs-12" placeholder="Nombre del Cliente Proveedor" /> </div> </div> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Destino </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="text" value='${movimiento.destino || ""}' data-dest="${movimiento.id_destino}" name="destino" id="${movimiento.id_movimiento}-destino" class="form-control col-md-7 col-xs-12" placeholder="Nombre del Cliente de Destino" /> </div> </div> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> N° de Parte <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="text" value="${(movimiento.no_parte == 5) ? movimiento.peso : movimiento.no_parte}" name="parte" id="${movimiento.id_movimiento}-parte" class="form-control col-md-7 col-xs-12" placeholder="N° de Parte" /> </div> </div> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Descripción de Parte <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="text" value="${movimiento.descripcion}" name="desc" id="${movimiento.id_movimiento}-parte-desc" class="form-control col-md-7 col-xs-12" placeholder="Descripción de la Parte" /> </div> </div> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Contenedor <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="text" value="${movimiento.id_contenedor || ""}" name="contenedor" id="${movimiento.id_movimiento}-contenedor" class="form-control col-md-7 col-xs-12" placeholder="N° de Contenedor" /> </div> </div> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Candado <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="text" value="${movimiento.id_candado || ""}" name="contenedor" id="${movimiento.id_movimiento}-candado" class="form-control col-md-7 col-xs-12" placeholder="N° de Candado" /> </div> </div> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Fecha <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="text" value="${fecha}" name="contenedor" id="${movimiento.id_movimiento}-fecha" class="form-control col-md-7 col-xs-12" placeholder="Fecha" /> </div> </div> </div> </form> </div> </div> </div> </div>`;

        mov.row.add([`{"movimiento":"${movimiento.id_movimiento}","clasificacion":"${movimiento.clas}"}`, movimiento.proveedor, movimiento.destino || "", (movimiento.no_parte == 5) ? movimiento.peso : movimiento.no_parte, movimiento.descripcion, fecha, `<button type="button" class="btn btn-primary editar" data-toggle="modal" title="Detalles" data-target="#modal-${movimiento.id_movimiento}"><span class="fa fa-eye"></span></button>`]).draw();

    });
    $('#ModalesMovimientos').html(modales);
    $('.ControlPrim').on('click change', function () {
        $('#MovimientosInfo tbody tr').hide();
        $(`[data-clasificacion="${$(this).data("clas")}"]`).show();
        mov.page.len(-1).draw();
        if ($(this).data("clas") == "Z") {
            $('#MovimientosInfo tbody tr').show();
            mov.page.len(10).draw();
        }
    });
    init_daterangepicker()
}
(function ($) {//Función para transformar las formas en json
    $.fn.serializeObject = function () {

        var self = this,
            json = {},
            push_counters = {},
            patterns = {
                "validate": /^[a-zA-Z][a-zA-Z0-9_]*(?:\[(?:\d*|[a-zA-Z0-9_]+)\])*$/,
                "key": /[a-zA-Z0-9_]+|(?=\[\])/g,
                "push": /^$/,
                "fixed": /^\d+$/,
                "named": /^[a-zA-Z0-9_]+$/
            };


        this.build = function (base, key, value) {
            base[key] = value;
            return base;
        };

        this.push_counter = function (key) {
            if (push_counters[key] === undefined) {
                push_counters[key] = 0;
            }
            return push_counters[key]++;
        };

        $.each($(this).serializeArray(), function () {

            // skip invalid keys
            if (!patterns.validate.test(this.name)) {
                return;
            }

            var k,
                keys = this.name.match(patterns.key),
                merge = this.value,
                reverse_key = this.name;

            while ((k = keys.pop()) !== undefined) {

                // adjust reverse_key
                reverse_key = reverse_key.replace(new RegExp("\\[" + k + "\\]$"), '');

                // push
                if (k.match(patterns.push)) {
                    merge = self.build([], self.push_counter(reverse_key), merge);
                }

                // fixed
                else if (k.match(patterns.fixed)) {
                    merge = self.build([], k, merge);
                }

                // named
                else if (k.match(patterns.named)) {
                    merge = self.build({}, k, merge);
                }
            }

            json = $.extend(true, json, merge);
        });

        return json;
    };
})(jQuery);
function init_daterangepicker() {
    months: "Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split("_"),
        moment().locale('es', {
            weekdays: "Dom_Lun_Mar_Mie_Jue_Vie_Sáb".split("_")
        });
    if ("undefined" != typeof $.fn.daterangepicker) {
        console.log("init_daterangepicker");
        var a = function (a, b, c) {
            console.log(a.toISOString(), b.toISOString(), c),
                $("#reportrange span").html(b.format("DD/MM/YYYY") + " - " + a.format("DD/MM/YYYY"))
        }
            , b = {
                startDate: moment(),
                showDropdowns: !0,
                showWeekNumbers: !0,
                timePicker: !1,
                timePickerIncrement: 1,
                timePicker12Hour: !0,
                ranges: {
                    Hoy: [moment(), moment()],
                    Ayer: [moment().subtract(1, "days"), moment().subtract(1, "days")],
                    "Últimos 7 días": [moment().subtract(6, "days"), moment()],
                    "Últimos 30 días": [moment().subtract(29, "days"), moment()],
                    "Este Mes": [moment().startOf("month"), moment().endOf("month")],
                    "Mes Pasado": [moment().subtract(1, "month").startOf("month"), moment().subtract(1, "month").endOf("month")]
                },
                opens: "left",
                buttonClasses: ["btn btn-default"],
                applyClass: "btn-small btn-primary",
                cancelClass: "btn-small",
                format: "MM/DD/YYYY",
                separator: " a ",
                locale: {
                    applyLabel: "Terminar",
                    cancelLabel: "Limpiar",
                    fromLabel: "Desde",
                    toLabel: "Hasta",
                    customRangeLabel: "Personalizar",
                    daysOfWeek: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sáb"],
                    monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
                    firstDay: 1
                }
            };
        $("#reportrange span").html(moment().subtract(29, "days").format("DD/MM/YYYY") + " - " + moment().format("DD/MM/YYYY")),
            $("#reportrange").daterangepicker(b, a),
            $("#reportrange").on("show.daterangepicker", function () {
                console.log("show event fired")
            }),
            $("#reportrange").on("hide.daterangepicker", function () {
                console.log("hide event fired")
            }),
            $("#reportrange").on("apply.daterangepicker", function (a, b) {
                console.log("apply event fired, start/end dates are " + b.startDate.format("DD/MM/YYYY") + " to " + b.endDate.format("DD/MM/YYYY"))
            }),
            $("#reportrange").on("cancel.daterangepicker", function (a, b) {
                console.log("cancel event fired")
            }),
            $("#options1").click(function () {
                $("#reportrange").data("daterangepicker").setOptions(b, a)
            }),
            $("#options2").click(function () {
                $("#reportrange").data("daterangepicker").setOptions(optionSet2, a)
            }),
            $("#destroy").click(function () {
                $("#reportrange").data("daterangepicker").remove()
            })
    }
}