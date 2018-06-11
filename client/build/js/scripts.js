//Función para incializar en la sección de recibo
async function initRecibo() {
    let selectColor=`<select class="form-control color" style="background-color:red">`;
    let fifoColorsTNET = ['C00000', 'FF0000', 'FFC000', 'FFFF00', '92D050', '00B050', '00B0F0', '0070C0', '002060', '7030A0'];//Colores FIFO de TNET
    $('#color').on('change',function(){
        let color = $(this).val();
        $(this).css('background-color', "#"+fifoColorsTNET[color]);
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
            a.color=color;
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
        singleClasses: "picker_4"
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
        count = 1;
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
                    } else {
                        $.notify(res.message);
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
async function initPartes(){
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
                t.row.add([parte.interior, parte.exterior, parte.descripcion, parte.cant_min,parte.existencia,`<div class="row"><div class="col-md-2"><button type="button" class="btn btn-primary" data-toggle="modal" data-target=".modal-lg">Large modal</button></div></div>`]);
            });
            t.draw();
        }
    });
    t.on( 'draw', function () {
        $('#piezas tr').on('click', function () {
            $(this).attr({'data-toggle':'modal','data-target':'.modal-lg'});
        });
    } );
   
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

