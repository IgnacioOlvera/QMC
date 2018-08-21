$('#logout').on('click', function () {
    setCookie('authorization', "");
    localStorage.clear();
    window.location.replace("/login");
});

// $("li ,th").not(`[data-${localStorage.getItem("lvl")}]`).remove();

async function initInicio() {
    let semanal = echarts.init(document.getElementById('semanal'));
    let mensual = echarts.init(document.getElementById('mensual'));
    let url = "/SemanalRepo";
    let entradas = [], salidas = [], categorias = [];
    let entr = [], sal = [], cat = [];
    let pet = await fetch(url, { headers: { authorization: getCookie("authorization") } });
    let result = await pet.json();
    result.forEach(res => {
        entradas.push(parseInt(res.recibos));
        salidas.push(parseInt(res.envios));
        categorias.push(`${res.inicio} a ${res.final}`)
    });

    url = "/MensualRepo";
    pet = await fetch(url, { headers: { authorization: getCookie("authorization") } });
    result = await pet.json();
    result.forEach(res => {
        entr.push(parseInt(res.recibos));
        sal.push(parseInt(res.envios));
        cat.push(res.mes)
    });
    // specify chart configuration item and data
    semanal.setOption({
        title: {
            text: 'Entradas y Salidas Semanales'
        }, tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            feature: {
                dataView: {
                    show: true, readOnly: false,
                    title: "Ver Info",
                    lang: [
                        "Información en Texto Plano",
                        "Cerrar",
                        "Actualizar"
                    ]
                },
                magicType: { show: true, type: 'line' },
                saveAsImage: { show: true, title: "Descargar Imágen" }
            }
        },
        legend: {
            data: ['Entradas', 'Salidas']
        },
        xAxis: [
            {
                type: 'category',
                data: categorias,
                axisPointer: {
                    type: 'shadow'
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: 'Cantidad',
                min: 0,
                max: 25,
                interval: 5
            }
        ],
        series: [
            {
                name: 'Entradas',
                type: 'bar',
                data: entradas,
                label: {
                    show: true,
                    position: 'inside',
                    fontStyle: 'italic'
                }
            },
            {
                name: 'Salidas',
                type: 'bar',
                data: salidas,
                label: {
                    show: true
                }
            }
        ]
    });
    mensual.setOption({
        title: {
            text: 'Entradas y Salidas Mensuales'
        }, tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            feature: {
                dataView: {
                    show: true, readOnly: false,
                    title: "Ver Info",
                    lang: [
                        "Información en Texto Plano",
                        "Cerrar",
                        "Actualizar"
                    ]
                },
                magicType: { show: true, type: 'line' },
                saveAsImage: { show: true, title: "Descargar Imágen" }
            }
        },
        legend: {
            data: ['Entradas', 'Salidas']
        },
        xAxis: [
            {
                type: 'category',
                data: cat,
                axisPointer: {
                    type: 'shadow'
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: 'Cantidad',
                min: 0,
                max: 25,
                interval: 5
            }
        ],
        series: [
            {
                name: 'Entradas',
                type: 'bar',
                data: entr,
                label: {
                    show: true,
                    position: 'inside',
                    fontStyle: 'italic'
                }
            },
            {
                name: 'Salidas',
                type: 'bar',
                data: sal,
                label: {
                    show: true
                }
            }
        ]
    });
}
//Función para incializar en la sección de recibo
async function initRecibo() {
    let info = {};
    let partesRecibo = [];
    let fifoColorsTNET = ['C00000', 'FF0000', 'FFC000', 'FFFF00', '92D050', '00B050', '00B0F0', '0070C0', '002060', '7030A0'];//Colores FIFO de TNET
    $('#color').on('change', function () {
        let color = $(this).val();
        $(this).css('background-color', "#" + fifoColorsTNET[color]);
    });

    let count = 1;//Contador para los costales
    let t = $('#piezasRecibo').DataTable({//Inicializar tabla de clientes.
        "ordering": false, "searching": false, "bPaginate": false
    });
    let tnet = $('#piezasTNET').DataTable({//Inicializar tabla de tnenet
        "ordering": false, "searching": false,
        "bPaginate": false
    });
    let pet = await fetch("clienteNat/0", { headers: { authorization: getCookie("authorization") } });//petición para llenar combo de clientes proveedores
    let clientes = await pet.json();
    $('#in_cliente').append('<option selected value="0"> Sección de cliente...</option>')
    clientes.forEach(cliente => {//Llenado de select con todos lo clientes
        (cliente.estado == 'ACTIVO') ? $('#in_cliente').append(`<option value='${cliente.id_cliente}'>${cliente.nombre}</option>`) : null;
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
        if ($(this).val() == 5) {//Si el valor es 4, se muestra la tabla de tnet
            $('#piezas').hide('oculto');//oculta la tabla de los clientes normales
            $('#tablaTNET').show('oculto');//muestra la tabla de tnet
        } else {
            $('#piezas').show('oculto');//mostrar la tabla de clientes normales
            $('#tablaTNET').hide('oculto');//ocultar la tabla de tnet
            let pet = await fetch('/proveedor/' + $(this).val(), { headers: { authorization: getCookie("authorization") } });//Petición para traer todas las piezas que surte un proveedor
            let partes = await pet.json();
            t.rows().remove().draw();//Quitar todos los elementos de la tabla.
            partes.forEach(parte => {//Agregar las filas con cada parte de cada proveedor a la tabla.
                (parte.estado == 0) ? t.row.add([parte.exterior, parte.interior, parte.descripcion, `<input type="number" min="0" data-validation="number" data-caja="${parte.caja}" data-pallet="${parte.pallet}" id="cant" name="cant_parte" class="form-control cantidad"/>`, `<label class="cajas">0</label>`, `<label class="pallets">0</label>`]).draw() : null;
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
        info = $("#form1").serializeObject();
        console.log(info);
        if (info.id_proveedor != 0 && info.fecha != null && info.id_contenedor != null && info.id_candado != null && info.id_nota != null) {
            let cantidades = t.$('.cantidad').serialize();//Obtener una cadena con todos los valores de los inputs de cantidades.
            cantidades = cantidades.replace(/cant_parte=/gi, "").split("&");//Quitar de la cadena cant_parte y separarlos por &
            t.rows().every(async function (rowIdx, tableLoop, rowLoop) { //loop para recorrer toda la tabla
                if (cantidades[rowIdx] > 0) {//Si la cantidad es mayor a 0
                    let a = $("#form1").serializeObject();//convertir los elementos del form en un objeto json.
                    let data = this.data();//data de la fila                
                    a.id_parte = data[1];//obtener la primera celda la fila y setearlo en el objeto json del form
                    a.cant_parte = cantidades[rowIdx];////obtener la celda de cantidades de la fila y setearlo en el objeto json del form
                    a = JSON.stringify(a);//Convertir a cadena el json
                    let options = {//opciones para la petición
                        method: 'POST',
                        body: a,
                        headers: { "Content-Type": "application/json", authorization: getCookie("authorization") }
                    }
                    let c = await fetch('/entradas', options);//petición
                    let res = await c.json();
                    t.$('.cantidad').val("");//regresar las cantidades a sus valores iniciales
                    t.$('label').text('0');//regresar las cantidades a sus valores iniciales
                    if (res.status == 200) {
                        $.notify(res.message, "success");//mensaje del backend
                        let p = await fetch(`/parte/${data[1]}`, { headers: { authorization: getCookie("authorization") } });
                        let r = await p.json();
                        let part = r[0];
                        part.cant = cantidades[rowIdx];
                        partesRecibo.push(part);
                    } else {
                        $.notify(res.message);
                    }
                }
                info.partes = JSON.parse(JSON.stringify(partesRecibo));

            });

            let pet = await fetch(`/cliente/${info.id_proveedor}`, { headers: { authorization: getCookie("authorization") } });
            let proveedor = await pet.json();
            info.cliente = JSON.parse(JSON.stringify(proveedor[0]));
            info.semana = moment(info.fecha, 'DD/MM/YYYY').week();
            $('#DetallesRecibo').modal('toggle');
        } else {
            $.notify("Falta Proporcionar Datos Obligatorios y/o Datos Válidos");
        }
    });




    $('#terminarReciboCostales').on('click', async function () {//Evento para terminar los recibos de contales

        info = $("#form1").serializeObject();
        let pesos = tnet.$('.peso').serialize().replace(/peso=/gi, "").split("&");//obtener los pesos de los costales.
        let seriales = tnet.$('.serial').serialize().replace(/serial=/gi, "").split("&");//obenter los seriales de los costales

        for (let i = 0; i < pesos.length - 1; i++) {
            for (let j = i + 1; j < pesos.length; j++) {
                if (pesos[i] > pesos[j]) {
                    let tempP = pesos[i];
                    let tempS = seriales[i];
                    pesos[i] = pesos[j];
                    seriales[i] = seriales[j];
                    pesos[j] = tempP;
                    seriales[j] = tempS;
                }

            }
        }
        tnet.rows().every(async function (rowIdx, tableLoop, rowLoop) {
            let a = $("#form1").serializeObject();//Convertir a json los objetos de la forma
            let color = $('#color').val();//Obtener la información de la línea recorrida
            a.secuencia = seriales[rowIdx];//setear en el json la secuencia del costal
            a.peso = pesos[rowIdx]//setear peso en el json la secuencia del costal
            a.cant_parte = 1;//setear la cantidad de partes
            a.color = color;
            a = JSON.stringify(a);//convertir en string  el objeto json para pasarlo al bakend
            let options = {//opciones de la petición
                method: 'POST',
                body: a,
                headers: { "Content-Type": "application/json", authorization: getCookie("authorization") }
            }
            let c = await fetch('/entradas', options);//petición
            let res = await c.json();
            tnet.rows().remove().draw();
            if (res.status == 200) {
                $.notify(res.message, "success");//mensaje del backend
            } else {
                $.notify(res.message);
                count = 1;
            }
        });

        let peso = pesos[0];
        let cant_x_caja = 0;
        for (let i = 0; i <= pesos.length; i++) {
            if (peso != pesos[i]) {
                partesRecibo.push({
                    no_parte: `HDPE MOLIDO LAVADO`,
                    cant: peso * cant_x_caja,
                    cant_x_caja: cant_x_caja,
                    remarks: `LEAF CORP.`

                });
                peso = pesos[i];
                cant_x_caja = 0;
            }
            cant_x_caja++;
        }
        info.partes = JSON.parse(JSON.stringify(partesRecibo));
        let pet = await fetch(`/cliente/${info.id_proveedor}`, { headers: { authorization: getCookie("authorization") } });
        let proveedor = await pet.json();
        info.cliente = JSON.parse(JSON.stringify(proveedor[0]));
        info.semana = moment(info.fecha, 'DD/MM/YYYY').week();
        $('#DetallesRecibo').modal('toggle');

    });

    $('#SetDetalles').on('click', function () {
        let d = $('#ReciboDetalleForm').serializeObject();
        console.log(info);
        if (d.pedimento != "" && d.factura != "" && d.operario != "") {
            if (info.partes.length > 0) {
                $('#generarDocumentacion').removeAttr('disabled');
            }
            info.pedimento = d.pedimento;
            info.factura = d.factura;
            info.operario = d.operario;
            $('#DetallesRecibo').modal('toggle');
        } else {
            $.notify("Faltan Campos Obligatorios y/o Válidos");
        }
    });

    $('#generarDocumentacion').on('click', async function () {
        let url = '/Receiving';
        let options = {//opciones para la petición
            method: 'POST',
            body: JSON.stringify(info),
            headers: { "Content-Type": "application/json", authorization: getCookie("authorization") }
        }
        let pet = await fetch(url, options);
        let ROK = await pet.json();
        if (ROK.status == 200) {
            $.notify(ROK.message, "success");
        } else {
            $.notify(ROK.message);
        }
        $(this).attr('disabled', true);
        info = {};
        partesRecibo = [];
        console.log(info);
    });
}
async function initEnvios() {
    let BLinfo = {}, OSinfo = {};
    let fifoColorsTNET = ['C00000', 'FF0000', 'FFC000', 'FFFF00', '92D050', '00B050', '00B0F0', '0070C0', '002060', '7030A0'];//Colores FIFO de TNET
    let count = 1;
    let t = $('#piezasRecibo').DataTable({//Inicializar tabla de clientes.
        "ordering": false, "searching": false, "bPaginate": false
    });
    let tnet = $('#piezasTNET').DataTable({//Inicializar tabla de tnenet
        "ordering": false, "searching": false, "bPaginate": false
    });

    let pet = await fetch('/clienteNat/0', { headers: { authorization: getCookie("authorization") } });
    let clientes = await pet.json();
    $('#in_cliente').append('<option selected value="0"> Sección de cliente...</option>')
    clientes.forEach(cliente => {
        (cliente.estado == 'ACTIVO') ? $('#in_cliente').append(`<option value='${cliente.id_cliente}'>${cliente.nombre}</option>`) : null;
    });
    let url = `/clienteNat/1`
    pet = await fetch(url, { headers: { authorization: getCookie("authorization") } })
    clientes = await pet.json();
    $('#in_clienteDest').append('<option selected value="0"> Sección de cliente...</option>')
    clientes.forEach(cliente => {
        (cliente.estado == 'ACTIVO') ? $('#in_clienteDest').append(`<option value='${cliente.id_cliente}'>${cliente.nombre}</option>`) : null;
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
    url = "/costales";
    pet = await fetch(url, { headers: { authorization: getCookie("authorization") } });
    let costales = await pet.json();

    costales.forEach(costal => {
        color = costal.color;
        tnet.row.add(['<input type="checkbox" id="check-all" class="flat">', `<label id="scotal" name="secuencia">${costal.secuencia}</label>`, `<label id="pcostal" name="peso">${costal.peso}</label>`, `<div class="col-md-1" style="width: 100px; height: 40px; background-color:#${fifoColorsTNET[color]}"> </div>`, `<label id="ncostal" name="nota">${costal.nota}</label>`]).draw();
    });
    tnet.$('input[type="checkbox"]').iCheck({
        checkboxClass: 'icheckbox_flat-red'
    });

    $('#in_cliente').on('change', async function () {
        if ($(this).val() == 5) {//Si el valor es 4, se muestra la tabla de tnet
            $('#piezas').hide('oculto');//oculta la tabla de los clientes normales
            $('#tablaTNET').show('oculto');//muestra la tabla de tnet
        } else {
            $('#piezas').show('oculto');//mostrar la tabla de clientes normales
            $('#tablaTNET').hide('oculto');//ocultar la tabla de tnet
            let pet = await fetch('/proveedor/' + $(this).val(), { headers: { authorization: getCookie("authorization") } });//Petición para traer todas las piezas que surte un proveedor
            let partes = await pet.json();
            t.rows().remove().draw();//Quitar todos los elementos de la tabla.
            partes.forEach(parte => {//Agregar las filas con cada parte de cada proveedor a la tabla.
                (parte.estado == 0) ? t.row.add([parte.exterior, parte.interior, parte.descripcion, `<input type="text" data-validation="number" data-caja="${parte.caja}" data-pallet="${parte.pallet}" id="cant" name="cant_parte" class="form-control cantidad"/>`, `<label class="cajas">0</label>`, `<label class="pallets">0</label>`]).draw() : null;
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
        let partesEnvio = [];
        let cantidades = t.$('.cantidad').serialize();//Obtener una cadena con todos los valores de los inputs de cantidades.
        let destino = $('#in_clienteDest').val();
        cantidades = cantidades.replace(/cant_parte=/gi, "").split("&");//Quitar de la cadena cant_parte y separarlos por &
        let a = $("#form1").serializeObject();//convertir los elementos del form en un objeto json.
        a.id_destino = destino;
        BLinfo.destino = destino;
        BLinfo.candado = a.candado;
        BLinfo.contenedor = a.contenedor;
        BLinfo.fecha = a.fecha;
        BLinfo.semana = moment(a.fecha, 'DD/MM/YYYY').week();
        let direc = `/cliente/${destino}/${a.id_proveedor}`;
        let f = await fetch(direc, { headers: { authorization: getCookie("authorization") } });
        let i = await f.json();
        BLinfo.cliente = JSON.parse(JSON.stringify(i));
        if (destino == 0 || a.id_proveedor == 0) {
            $.notify("Falta llenar campos obligatorios  (*)");
        } else {
            t.rows().every(async function (rowIdx, tableLoop, rowLoop) { //loop para recorrer toda la tabla
                if (cantidades[rowIdx] > 0) {//Si la cantidad es mayor a 0
                    a = $("#form1").serializeObject();

                    let data = this.data();//data de la fila
                    a.id_parte = data[0];//obtener la primera celda la fila y setearlo en el objeto json del form
                    a.cant_parte = cantidades[rowIdx];////obtener la celda de cantidades de la fila y setearlo en el objeto json del form
                    a = JSON.stringify(a);//Convertir a cadena el json
                    let options = {//opciones para la petición
                        method: 'POST',
                        body: a,
                        headers: { "Content-Type": "application/json", authorization: getCookie("authorization") }
                    }
                    let c = await fetch('/salidas', options);//petición
                    let res = await c.json();
                    t.$('.cantidad').val("");//regresar las cantidades a sus valores iniciales
                    t.$('label').text('0');//regresar las cantidades a sus valores iniciales
                    if (destino != 0 || a.id_proveedor != 0) {
                        if (res.status == 200) {
                            $.notify(res.message, "success");//mensaje del backend
                            let url = `/parte/${data[1]}`;
                            let p = await fetch(url, { headers: { authorization: getCookie("authorization") } });
                            let r = await p.json();
                            let part = {};
                            part.no_parte = r[0].no_parte;
                            part.no_parte_ext = r[0].no_parte_ext;
                            part.cant = cantidades[rowIdx];
                            part.descripcion = r[0].descripcion;
                            part.cant_x_caja = r[0].cant_x_caja;
                            part.cant_x_pallet = r[0].cant_x_pallet;
                            part.peso = r[0].peso;
                            part.precio = r[0].precio;
                            partesEnvio.push(part);
                            count = 0;
                        } else {
                            $.notify(res.message);
                            count = 0;
                        }
                    }
                }
                BLinfo.partes = JSON.parse(JSON.stringify(partesEnvio));
                if (BLinfo.partes.length > 0) {
                    $('#generarDocumentacion').removeAttr('disabled');
                }
            });
        }

    });
    $('#terminarReciboCostales').on('click', async function () {//Evento para terminar los recibos de contales
        let a = $("#form1").serializeObject();//Convertir a json los objetos de la forma
        BLinfo.destino = a.id_destino;
        BLinfo.candado = a.candado;
        BLinfo.contenedor = a.contenedor;
        BLinfo.fecha = a.fecha;
        BLinfo.semana = moment(a.fecha, 'DD/MM/YYYY').week();
        let direc = `/cliente/${a.id_destino}/${a.id_proveedor}`;
        let f = await fetch(direc, { headers: { authorization: getCookie("authorization") } });
        let i = await f.json();
        BLinfo.cliente = JSON.parse(JSON.stringify(i));
        let costalesEnvio = [];
        $('#piezasTNET > tbody  > tr > td > .checked').each(async function () {
            if (a.id_destino != 0 && a.id_cliente != 0 && a.fecha != 0) {
                var datos = [];
                var row = tnet.row($(this).parents('tr'));
                row.remove().draw();
                $($($(this).parent().siblings().children('label'))).each(function () {
                    datos.push($(this).text());
                });
                a.secuencia = datos[0];//setear en el json la secuencia del costal
                a.peso = datos[1]//setear peso en el json la secuencia del costal
                a.cant_parte = "1";//setear la cantidad de partes
                a.nota = datos[2];
                //convertir en string  el objeto json para pasarlo al bakend
                let options = {//opciones de la petición
                    method: 'POST',
                    body: JSON.stringify(a),
                    headers: { "Content-Type": "application/json", authorization: getCookie("authorization") }
                }
                let c = await fetch('/salidas', options);//petición
                let res = await c.json();
                if (res.status == 200) {
                    $.notify(res.message, "success");//mensaje del backend
                    $('#generarDocumentacion').attr('disabled', false);
                    cont = 0;
                    costalesEnvio.push({
                        no_parte: datos[0],
                        descripcion: `HPDE MOLIDO LAVADO`,
                        peso: datos[2]
                    });
                    BLinfo.partes = JSON.parse(JSON.stringify(costalesEnvio));
                } else {
                    $.notify(res.message);
                }

            } else {
                $.notify("Falta Proporcionar Datos Obligatorios (*)");
                cont = 0;
            }

        });
    });
    $('#generarDocumentacion').on('click', async function () {
        //Generar Bill Of Landing
        let url = '/BillOfLanding';
        let options = {//opciones para la petición
            method: 'POST',
            body: JSON.stringify(BLinfo),
            headers: { "Content-Type": "application/json", authorization: getCookie("authorization") }
        }
        let pet = await fetch(url, options);
        let BLOK = await pet.json();
        // //Generar Order Sheet
        let url1 = '/OrderSheet';
        let o = {
            method: 'POST',
            body: JSON.stringify(BLinfo),
            headers: { "Content-Type": "application/json", authorization: getCookie("authorization") }
        }
        let pet1 = await fetch(url1, o);
        let OSOK = await pet1.json();
        // //Generar Packing List
        let url2 = '/PackingList';
        let p = {
            method: 'POST',
            body: JSON.stringify(BLinfo),
            headers: { "Content-Type": "application/json", authorization: getCookie("authorization") }
        }
        let pet2 = await fetch(url2, p);
        let PLOK = await pet2.json();
        //Deshabilitar botón
        $(this).attr('disabled', true);
        BLinfo = {};
        if (BLOK.status == 200 && OSOK.status == 200 && PLOK.status == 200) {
            $.notify('Documentación Generada Satisfactoriamente', 'success');
        } else {
            $.notify('Ocurrió un Error');
        }
    });
}
async function initPartes() {
    let fifoColorsTNET = ['C00000', 'FF0000', 'FFC000', 'FFFF00', '92D050', '00B050', '00B0F0', '0070C0', '002060', '7030A0'];//Colores FIFO 
    let modales = "";
    let t = $('#piezasRecibo').DataTable({//Inicializar tabla de clientes.
        "ordering": false,
        "createdRow": function (row, data) {
            info = JSON.parse(data[0]);
            $(row).attr("data-prove", info.proveedor);
            let min = data[4];
            let existencia = data[5];
            (min > existencia) ? setInterval(function () {
                $(row).css({
                    "color": "black", "background-color": function () {
                        this.switch = !this.switch
                        return this.switch ? "#d51f2e9c" : "#fff"
                    }, 'font-weight': 'bold'
                });
            }, 700) : "";
            (info.estado == 1) ? $(row).css({ 'background-color': "#d51f2e9c", 'color': 'black' }) : null;

        }, "columnDefs": [
            {
                "targets": [0],
                "visible": false
            }
        ], "bPaginate": false, "searching": false
    });
    let tnet = $('#piezasTNET').DataTable({//Inicializar tabla de tnenet
        "ordering": false,
        "createdRow": function (row, data, index) {
            $('td', row).eq(4).css('background-color', "#" + fifoColorsTNET[data[4]]).html("");
        }, "bPaginate": false,
    });
    let pet = await fetch('/clienteNat/0', { headers: { authorization: getCookie("authorization") } });
    let clientes = await pet.json();
    $('#in_cliente').append('<option selected value="0"> Sección de cliente...</option>')
    clientes.forEach(cliente => {
        (cliente.estado == 'ACTIVO') ? $('#in_cliente').append(`<option value='${cliente.id_cliente}'>${cliente.nombre}</option>`) : null;
    });
    pet = await fetch("/costales", { headers: { authorization: getCookie("authorization") } });
    let costales = await pet.json();
    let tnetmodals = "";
    costales.forEach(costal => {
        let fecha = costal.fecha.split("T")[0];
        let color = costal.color;
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
            headers: { "Content-Type": "application/json", authorization: getCookie("authorization") }
        }
        let url = "/costales";
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
    let j = await fetch('/proyectos', { headers: { authorization: getCookie("authorization") } });
    let proyectos = await j.json();
    let bandera = true;
    let sproyectos = "";
    proyectos.forEach(proyecto => {
        sproyectos += `<option value=${proyecto.id_proyecto}>${proyecto.nombre}</option>`
    });
    $('#in_proyecto').html(sproyectos);
    $('#in_cliente').on('change', async function () {
        if (bandera == true) {
            let pet = await fetch('/proveedor', { headers: { authorization: getCookie("authorization") } });//Petición para traer todas las piezas que surte un proveedor
            let partes = await pet.json();
            partes.forEach(parte => {
                (parte.exterior == null) ? parte.exterior = "" : parte.exterior;
                modales += `<div style="display:none" id="modal-${parte.interior}" class="modal fade  in" tabindex="-1" role="dialog" aria-hidden="true" style="display: block; padding-right: 15px;"> <div class="modal-dialog modal-lg"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal"> <span aria-hidden="true">×</span> </button> <h4 class="modal-title" id="myModalLabel">${parte.descripcion} - ${parte.interior}</h4> </div> <div class="modal-body"> <form id="Parte-${parte.interior}-Details" class="form-horizontal form-label-left"> <div class="col-md-12"> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> N° de Parte <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="text" value="${parte.interior}" name="no_parte" id="in_no_parte-${parte.interior}" class="form-control col-md-7 col-xs-12" placeholder="Ingresar Número de Parte" /> </div> </div> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> N° de Parte Exterior </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="text" value="${parte.exterior}" name="no_parte_ext" id="in_no_parte_ext-${parte.exterior}" class="form-control col-md-7 col-xs-12" placeholder="Ingresar Número de Parte Exterior En Caso de Existir" /> </div> </div> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Descripción <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="text" name="descripcion" value="${parte.descripcion}" id="in_decripcion-${parte.interior}" class="form-control col-md-7 col-xs-12" placeholder="Descripción" /> </div> </div> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Cantidad X Caja <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="number" min="0" value="${parte.caja}" name="cant_x_caja" id="in_cantxcaja-${parte.interior}" class="form-control col-md-7 col-xs-12" placeholder="Cantidad por Caja" /> </div> </div> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Cantidad X Pallet <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="number" value="${parte.pallet}" min="0" name="cant_x_pallet" id="in_cantxpallet-${parte.interior}" class="form-control col-md-7 col-xs-12" placeholder="Cantidad por Pallet" /> </div> </div> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Cantidad X Mínima <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="number" value="${parte.cant_min}" min="0" name="cant_min" id="in_cant_min-${parte.interior}" class="form-control col-md-7 col-xs-12" placeholder="Cantidad Mínima" /> </div> </div> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Existencia <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="number" min="0" value="${parte.existencia}" name="existencia" id="in_existencia-${parte.interior}" class="form-control col-md-7 col-xs-12" placeholder="Cantidad Mínima" /> </div> </div> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Peso por Unidad <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="number" min="0" name="peso" value="${parte.peso}" id="in_peso-${parte.interior}" class="form-control col-md-7 col-xs-12" placeholder="Peso por Unidad" /></div></div><div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Precio por Unidad <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="number" min="0" name="precio" id="in_precio-${parte.interior}" value="${parte.precio}" class="form-control col-md-7 col-xs-12" placeholder="Precio por Unidad" /> </div> </div><div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Estado <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <select class="form-control col-md-7 col-xs-12" name="estado" id="parte_estado-${parte.interior}"> <option value="${parte.estado}" selected>${(parte.estado == 1) ? 'Inactivo' : 'Activo'}</option> <option value="0">Activo</option> <option value="1">Inactivo</option> </select> </div> </div> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Proyecto <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <select name="id_proyecto" id="in_proyecto-${parte.interior}" class="form-control col-md-7 col-xs-12"><option value="${parte.id_proyecto}" selected>${parte.proyecto}</option> ${sproyectos}</select> </div> </div></div> </form></div> <div class="modal-footer"> <button type="button" data-target="${parte.interior}" data-parte="${parte.interior}" class="btn btn-primary actualizarParte">Guardar Cambios</button></div> </div> </div> </div>`;
                let cajas = Math.floor(parte.existencia / parte.caja);
                let tarimas = Math.floor(cajas / parte.pallet);
                t.row.add([`{"proveedor":${parte.id_proveedor},"estado":${parte.estado}}`, parte.exterior, parte.interior, parte.descripcion, parte.cant_min, parte.existencia, cajas, tarimas, parte.proyecto, `<button type="button" class="btn btn-primary editar" data-toggle="modal" title="Editar" data-parte=${parte.interior} data-target="#modal-${parte.interior}"><span class="fa fa-edit"></span></button><button data-target="${parte.interior}" type="button" title="Eliminar" class="btn btn-danger eliminar"><span class="fa fa-times"></span></button>`]).draw().node();
            });
            t.draw();
            bandera = !bandera;
        }
        if ($(this).val() == 5) {//Si el valor es 4, se muestra la tabla de tnet
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
                    headers: { "Content-Type": "application/json", authorization: getCookie("authorization") }
                }
                let pet = await fetch(`/parte/${parte}`, options);
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
                    headers: { "Content-Type": "application/json", authorization: getCookie("authorization") }
                }
                let pet = await fetch('/parte/0', options);
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
                headers: { "Content-Type": "application/json", authorization: getCookie("authorization") }
            }
            let url = "/parte/1"
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
    let TablaClientes = $('#ClientesInfo').DataTable({
        "searching": false, "bPaginate": false
    });
    let url = "/cliente";
    let pet = await fetch(url, { headers: { authorization: getCookie("authorization") } });
    let clientes = await pet.json();
    let modales = "", nat = ['Proveedor', 'Cliente'];
    clientes.forEach(cliente => {
        modales += `<div style="display:none" id="modal-${cliente.id_cliente}" class="modal fade modal-costales in" tabindex="-1" role="dialog" aria-hidden="true" style="display: block; padding-right: 15px;"> <div class="modal-dialog modal-lg"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal"> <span aria-hidden="true">×</span> </button> <h4 class="modal-title" id="myModalLabel">${cliente.nombre}</h4> </div> <div class="modal-body"> <form id="${cliente.id_cliente}-Info" class="form-horizontal form-label-left"> <div class="col-md-12"> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Nombre del cliente <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="text" value="${cliente.nombre}" name="nombre" id="cliente_nombre_${cliente.id_cliente}" class="form-control col-md-7 col-xs-12" placeholder="Nombre del Cliente" /> </div> </div> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Dirección </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="text" value='${cliente.direccion}' name="direccion" id="cliente_direccion_${cliente.id_cliente}" class="form-control col-md-7 col-xs-12" placeholder="Dirección del Cliente" /> </div> </div> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> RFC <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="text" value=${cliente.RFC} name="rfc" id="cliente_rfc_${cliente.id_cliente}" class="form-control col-md-7 col-xs-12" placeholder="RFC" /> </div> </div><div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Razón Social <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="text" name="rsocial" id="cliente_rsocial-${cliente.id_cliente}" class="form-control col-md-7 col-xs-12" value="${cliente.rsocial}" placeholder="Razón Social" /> </div> </div> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Tipo de Cliente <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <select class="form-control col-md-7 col-xs-12" name="nat" id="nat_${cliente.id_cliente}" data-val="${cliente.nat}"> <option value="${cliente.nat}" disabled selected>Proveedor/Cliente</option> <option value="0">Proveedor</option> <option value="1">Cliente</option> </select> </div> </div> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Estado <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <select class="form-control col-md-7 col-xs-12" name="estado" data-val="${cliente.estado}" id="estado_${cliente.id_cliente}"> <option value="${cliente.estado}" disabled selected >Activo/Inactivo</option> <option value="ACTIVO">Activo</option> <option value="INACTIVO">Inactivo</option> </select> </div> </div> </div> </form> </div> <div class="modal-footer"> <button type="button" data-target=${cliente.id_cliente} class="btn btn-primary actualizarCliente">Guardar Cambios</button> </div> </div> </div> </div>`;

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
        let url = "/cliente/0";
        let options = {
            method: 'post',
            body: JSON.stringify(form),
            headers: { "Content-Type": "application/json", authorization: getCookie("authorization") }
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
        let url = "/cliente/" + cliente;
        let options = {
            method: 'delete',
            headers: { "Content-Type": "application/json", authorization: getCookie("authorization") }
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
        let url = "/cliente/1";
        let options = {
            method: 'post',
            body: JSON.stringify(form),
            headers: { "Content-Type": "application/json", authorization: getCookie("authorization") }
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
var mov = document.getElementById('MovimientosInfo');
if (mov != null) {
    var mov = $('#MovimientosInfo').DataTable({
        "createdRow": function (row, data) {
            let info = JSON.parse(data[0]);
            $(row).attr({ "data-clasificacion": info.clasificacion, "data-id": info.movimiento });
        }, "columnDefs": [
            {
                "targets": [0],
                "visible": false
            }
        ],
        "searching": false, "bPaginate": false,
    });
}
async function initMovimientos() {

    let url = "/movimientos"
    let pet = await fetch(url, { headers: { authorization: getCookie("authorization") } });
    let movimientos = await pet.json();
    let modales = "";
    movimientos.forEach(movimiento => {
        let fecha = movimiento.fecha.split("T")[0];
        modales += `<div style="display:none" id="modal-${movimiento.id_movimiento}" class="modal fade modal-costales in" tabindex="-1" role="dialog" aria-hidden="true" style="display: block; padding-right: 15px;"> <div class="modal-dialog modal-lg"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal"> <span aria-hidden="true">×</span> </button> <h4 class="modal-title" id="myModalLabel">Movimiento ${movimiento.id_movimiento} del ${movimiento.fecha}</h4> </div> <div class="modal-body"> <form id="${movimiento.id_movimiento}-Info" class="form-horizontal form-label-left"> <div class="col-md-12"> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Origen <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="text" value="${movimiento.proveedor}" data-prove="${movimiento.id_proveedor}" name="origen" id="${movimiento.id_movimiento}-proveedor" class="form-control col-md-7 col-xs-12" placeholder="Nombre del Cliente Proveedor" /> </div> </div> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Destino </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="text" value='${movimiento.destino || ""}' data-dest="${movimiento.id_destino}" name="destino" id="${movimiento.id_movimiento}-destino" class="form-control col-md-7 col-xs-12" placeholder="Nombre del Cliente de Destino" /> </div> </div> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> N° de Parte <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="text" value="${(movimiento.no_parte == 5) ? movimiento.peso : movimiento.no_parte}" name="parte" id="${movimiento.id_movimiento}-parte" class="form-control col-md-7 col-xs-12" placeholder="N° de Parte" /> </div> </div> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Descripción de Parte <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="text" value="${movimiento.descripcion}" name="desc" id="${movimiento.id_movimiento}-parte-desc" class="form-control col-md-7 col-xs-12" placeholder="Descripción de la Parte" /> </div> </div> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Contenedor <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="text" value="${movimiento.id_contenedor || ""}" name="contenedor" id="${movimiento.id_movimiento}-contenedor" class="form-control col-md-7 col-xs-12" placeholder="N° de Contenedor" /> </div> </div> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Candado <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="text" value="${movimiento.id_candado || ""}" name="contenedor" id="${movimiento.id_movimiento}-candado" class="form-control col-md-7 col-xs-12" placeholder="N° de Candado" /> </div> </div> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Fecha <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="text" value="${fecha}" name="contenedor" id="${movimiento.id_movimiento}-fecha" class="form-control col-md-7 col-xs-12" placeholder="Fecha" /> </div> </div> </div> </form> </div> </div> </div> </div>`;

        mov.row.add([`{"movimiento":"${movimiento.id_movimiento}","clasificacion":"${movimiento.clas}"}`, movimiento.proveedor, movimiento.destino || "", (movimiento.no_parte == 5) ? movimiento.peso : movimiento.no_parte, movimiento.descripcion, movimiento.fechaf, movimiento.cant_parte, movimiento.cant_anterior, movimiento.cant_posterior, `<button type="button" class="btn btn-primary editar" data-toggle="modal" title="Detalles" data-target="#modal-${movimiento.id_movimiento}"><span class="fa fa-eye"></span></button>`]).draw();

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
    init_daterangepicker();
}
async function initContactos() {
    let p = await fetch('/cliente', { headers: { authorization: getCookie("authorization") } });
    let clientes = await p.json();
    let selectCliente = '<select class="form-control" name="cliente" id="NuevoContactoCliente">';
    selectCliente += '<option value="0" selected disabled> Selección de cliente...</option>';
    clientes.forEach(cliente => {
        selectCliente += `<option value='${cliente.id_cliente}'>${cliente.nombre}</option>`;
    });
    selectCliente += "</select>";
    $('#SeleccionClient').html(selectCliente);

    let info = $('#ContactosInfo').DataTable({
        "createdRow": function (row, data) {
            let info = JSON.parse(data[0]);
            $(row).attr({
                "data-contacto": info.id_contacto,
                "data-cliente": info.id_cliente
            });
            if (info.estado == 0) {
                $(row).css({
                    'background-color': '#d51f2e9c',
                    'color': 'black',
                    'font-weight': 'bold'
                });
            }
        }, "columnDefs": [
            {
                "targets": [0],
                "visible": false
            }
        ], "searching": false, "bPaginate": false
    });
    let url = "/contacto";
    let pet = await fetch(url, { headers: { authorization: getCookie("authorization") } });
    let contactos = await pet.json();
    let modales = "";
    let cliente = ""
    contactos.forEach(contacto => {
        cliente = `<select class="form-control" name="cliente" id="${contacto.id_contacto}-cliente">`;
        cliente += `<option value="${contacto.id_cliente}" selected> Selección de cliente...</option>`;
        clientes.forEach(client => {
            cliente += `<option value='${client.id_cliente}'>${client.nombre}</option>`;
        });
        cliente += "</select>";
        modales += `<div style="display:none" id="modal-${contacto.id_contacto}" class="modal fade modal-costales in" tabindex="-1" role="dialog" aria-hidden="true" style="display: block; padding-right: 15px;"> <div class="modal-dialog modal-lg"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal"> <span aria-hidden="true">×</span> </button> <h4 class="modal-title" id="myModalLabel">${contacto.nombre} de ${contacto.cliente}</h4> </div> <div class="modal-body"> <form id="${contacto.id_contacto}-Info" class="form-horizontal form-label-left"> <div class="col-md-12"> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Nombre <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="text" value="${contacto.nombre}" name="nombre" id="${contacto.id_contacto}-nombre" class="form-control col-md-7 col-xs-12" placeholder="Nombre del Contacto" /> </div> </div> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Teléfono </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="text" value='${contacto.telefono}' name="telefono" id="${contacto.id_contacto}-telefono" class="form-control col-md-7 col-xs-12" placeholder="Teléfono de Contacto" /> </div> </div> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Extensión <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="text" value="${contacto.ext || ''}" name="ext" id="${contacto.id_contacto}-ext" class="form-control col-md-7 col-xs-12" placeholder="Ext." /> </div> </div> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Correo <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="text" value="${contacto.correo}" name="correo" id="${contacto.id_contacto}-correo" class="form-control col-md-7 col-xs-12" placeholder="Correo" /> </div> </div> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Cliente <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> ${cliente} </div> </div><div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Estado <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <select class="form-control col-md-7 col-xs-12" name="estado" id="contacto_estado-${contacto.id_contacto}"> <option value="${contacto.estado}" selected>${(contacto.estado == 0) ? 'Inactivo' : 'Activo'}</option> <option value="1">Activo</option> <option value="0">Inactivo</option> </select> </div> </div> </div> </form>  <div class="modal-footer"> <button type="button" data-target="#${contacto.id_contacto}-Info" data-modal="#modal-${contacto.id_contacto}" data-contacto="${contacto.id_contacto}" class="btn btn-primary actualizarContacto">Guardar Cambios</button> </div> </div> </div> </div> </div>`;

        info.row.add([`{"id_contacto":"${contacto.id_contacto}","id_cliente":"${contacto.id_cliente}","estado":${contacto.estado}}`, contacto.nombre, contacto.telefono, contacto.ext, contacto.correo, contacto.cliente, `<button type="button" class="btn btn-primary editar" data-toggle="modal" title="Editar" data-target="#modal-${contacto.id_contacto}"><span class="fa fa-edit"></span></button><button data-target="${contacto.id_contacto}" type="button" title="Eliminar" class="btn btn-danger eliminar"><span class="fa fa-times"></span></button>`]).draw();
    });

    $('#ModalesContactos').html(modales);

    $('#GuardarContacto').on('click', async function () {
        let form = $('#AgregarContactoForm').serializeObject();
        let options = {
            method: 'post',
            body: JSON.stringify(form),
            headers: { "Content-Type": "application/json", authorization: getCookie("authorization") }
        }
        let url = "/contacto/1";
        let pet = await fetch(url, options);
        let res = await pet.json();
        if (form.nombre != "" || null && telefono != "" || null && correo != "" || null && form.cliente == 0) {
            if (res.status == "200") {
                $.notify(res.message, "success");
                $('#AgregarContactoForm')[0].reset();
                info.clear();
                $('#AgregarContactoModal').modal('toggle');
                url = "/contacto";
                pet = await fetch(url, { headers: { authorization: getCookie("authorization") } });
                let contactos = await pet.json();
                contactos.forEach(contacto => {
                    info.row.add([`{"id_contacto":"${contacto.id_contacto}","id_cliente":"${contacto.id_cliente}","estado":${contacto.estado}}`, contacto.nombre, contacto.telefono, contacto.ext, contacto.correo, contacto.cliente, `<button type="button" class="btn btn-primary editar" data-toggle="modal" title="Editar" data-target="#modal-${contacto.id_contacto}"><span class="fa fa-edit"></span></button><button data-target="${contacto.id_contacto}" type="button" title="Eliminar" class="btn btn-danger eliminar"><span class="fa fa-times"></span></button>`]).draw();
                });

            } else if (res.status == "500") {
                $.notify(res.message);
            }
        } else {
            $.notify("Falta Proporcionar Datos Obligatorios y/o Válidos");
        }

    });

    $('.actualizarContacto').on('click', async function () {
        let form = $($(this).data('target')).serializeObject();
        form.id_contacto = $(this).data("contacto");
        let options = {
            method: 'post',
            body: JSON.stringify(form),
            headers: { "Content-Type": "application/json", authorization: getCookie("authorization") }
        }
        let url = "/contacto/0";
        let pet = await fetch(url, options);
        let res = await pet.json();
        if (form.nombre != "" || null && telefono != "" || null && correo != "" || null && form.cliente == 0) {
            if (res.status == "200") {
                $.notify(res.message, "success");
                $($(this).data('target'))[0].reset();
                info.clear();
                $($(this).data("modal")).modal('toggle');
                url = "/contacto";
                pet = await fetch(url, { headers: { authorization: getCookie("authorization") } });
                let contactos = await pet.json();
                contactos.forEach(contacto => {
                    info.row.add([`{"id_contacto":"${contacto.id_contacto}","id_cliente":"${contacto.id_cliente}","estado":${contacto.estado}}`, contacto.nombre, contacto.telefono, contacto.ext, contacto.correo, contacto.cliente, `<button type="button" class="btn btn-primary editar" data-toggle="modal" title="Editar" data-target="#modal-${contacto.id_contacto}"><span class="fa fa-edit"></span></button><button data-target="${contacto.id_contacto}" type="button" title="Eliminar" class="btn btn-danger eliminar"><span class="fa fa-times"></span></button>`]).draw();
                });

            } else if (res.status == "500") {
                $.notify(res.message);
            }
        } else {
            $.notify("Falta Proporcionar Datos Obligatorios y/o Válidos");
        }
    });

    $('.eliminar').on('click', async function () {
        let url = `/contacto/${$(this).data("target")}`;
        let options = {
            method: 'put',
            headers: { "Content-Type": "application/json", authorization: getCookie("authorization") }
        }
        let pet = await fetch(url, options);
        let res = await pet.json();

        if (res.status == "200") {
            $.notify(res.message, "success");
            console.log($('#ContactosInfo').find(`[data-contacto="${$(this).data('target')}"]`));
            $('#ContactosInfo').find(`[data-contacto=${$(this).data('target')}]`).css({
                'background-color': '#d51f2e9c',
                'color': 'black',
                'font-weight': 'bold'
            });
            //info.row($(this).parents('tr')).remove().draw();
        } else if (res.status == "500") {
            $.notify(res.message);
        }
    });
}
async function initProyectos() {
    let tabla = $('#proyectos').DataTable({
        "ordenering": false,
        "createdRow": function (row, data) {
            let info = JSON.parse(data[0]);
            $(row).attr("data-owner", info.propietario);
        }, "columnDefs": [
            {
                "targets": [0],
                "visible": false
            }
        ], "ordering": false, "searching": false, "bPaginate": false
    });

    let pet = await fetch('/clienteNat/0', { headers: { authorization: getCookie("authorization") } });
    let clientes = await pet.json();
    $('.in_propietario').append('<option selected value="0"> Sección de cliente...</option>');
    clientes.forEach(cliente => {
        (cliente.estado == 'ACTIVO') ? $('.in_propietario').append(`<option value='${cliente.id_cliente}'>${cliente.nombre}</option>`) : null;
    });

    $('#registroProyecto').on('click', async function () {
        let form = $('#RegistrarProyectoForm').serializeObject();
        if (form.proyecto != null && form.propietario != 0 && form != null) {
            let options = {
                method: 'post',
                body: JSON.stringify(form),
                headers: { "Content-Type": "application/json", authorization: getCookie("authorization") }
            }

            let url = "/proyectos/1"
            let pet = await fetch(url, options);
            let res = await pet.json();

            if (res.status == 200) {
                $.notify("Parte Registrada Correctamente", "success");
                $('#AgregarProyectoModal').modal('toggle');
            } else if (res.status == 500) {
                $.notify("Falta Proporcionar Datos Obligatorios y/o Válidos");
            }

        } else {
            $.notify("Falta Proporcionar Datos Obligatorios y/o Válidos");
        }
    });


    pet = await fetch('/proyectos', { headers: { authorization: getCookie("authorization") } });
    let proyectos = await pet.json();
    let modalesProyectos = "";
    for (i in proyectos) {
        let proyecto = proyectos[i];
        let scliente = `<select class="form-control" name="propietario" id="${proyecto.id_proyecto}-propietario">`;
        scliente += `<option value="${proyecto.id_cliente}" selected> ${proyecto.propietario}</option>`;
        clientes.forEach(client => {
            scliente += `<option value='${client.id_cliente}'>${client.nombre}</option>`;
        });
        scliente += "</select>";
        modalesProyectos += `<div style="display:none" id="modal-proyecto-${proyecto.id_proyecto}" class="modal fade  in" tabindex="-1" role="dialog" aria-hidden="true" style="display: block; padding-right: 15px;"> <div class="modal-dialog modal-lg"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal"> <span aria-hidden="true">×</span> </button> <h4 class="modal-title" id="myModalLabel">Registro de Proyectos</h4> </div> <div class="modal-body"> <form id="editar-proyecto-${proyecto.id_proyecto}" class="form-horizontal form-label-left"> <div class="col-md-12"> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Proyecto <span class="required">*</span> </label> <div class="col-md-6 col-sm-6 col-xs-12"> <input type="text" name="proyecto" id="in_proyecto-${proyecto.id_proyecto}" value='${proyecto.nombre}' class="form-control col-md-7 col-xs-12" placeholder="Ingresar Nombre Proyecto" /> </div> </div> <div class="item form-group"> <label class="control-label col-md-3 col-sm-3 col-xs-12"> Propietario </label> <div class="col-md-6 col-sm-6 col-xs-12"> ${scliente} </div> </div> </div> </form> </div> <div class="modal-footer"> <button id="registroProyecto" data-modal="#modal-proyecto-${proyecto.id_proyecto}" data-pointer='${proyecto.id_proyecto}' data-target='#editar-proyecto-${proyecto.id_proyecto}' type="button" class="btn btn-primary editar">Editar </button> </div> </div> </div> </div>`;

        tabla.row.add([`{"propietario":"${proyecto.id_cliente}"}`, proyecto.nombre, proyecto.propietario, `<button type="button" class="btn btn-primary editarc" data-toggle="modal" data-proyecto=${proyecto.id_proyecto} data-target="#modal-proyecto-${proyecto.id_proyecto}">Editar <span class="fa fa-edit"></span></button><button type="button" class="btn btn-warning reporte" data-nombre="${proyecto.nombre}" data-proyecto='${proyecto.id_proyecto}'>Generar Reporte</button>`]).draw();
    }

    $('#modals').html(modalesProyectos);

    $('.editar').on('click', async function () {
        let data = $($(this).data('target')).serializeObject();
        if (data.propietario != null && data.proyecto != null) {
            let url = '/proyectos/0';
            data.id_proyecto = $(this).data('pointer');
            let options = {
                method: 'post',
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json", authorization: getCookie("authorization") }
            }
            let pet = await fetch(url, options);
            let res = await pet.json();
            if (res.status == 200) {
                $.notify(res.message, 'success');
                $($(this).data('modal')).modal('toggle');
            } else if (res.status == 500) {
                $.notify(res.message);
            }
        } else {
            $.notify("Falta Proporcionar Datos Obligatorios y/o Válidos");
        }
    });

    $('.reporte').on('click', async function () {
        let pet = await fetch(`/ReleaseReceiving/${$(this).data("proyecto")}/${$(this).data("nombre")}`, { headers: { authorization: getCookie("authorization") } });
        let res = await pet.json();
        let p = await fetch(`/ReleaseShipments/${$(this).data("proyecto")}/${$(this).data("nombre")}`, { headers: { authorization: getCookie("authorization") } });
        let r = await p.json();
        if (res.status == 200 && r.status == 200) {
            $.notify(res.message, "success");
            $.notify(r.message, "success");
        } else {
            $.notify(res.message);
            $.notify(r.message);
        }
    });

    $('.in_propietario').on('change', function () {
        let rows = $('#proyectos').find(`[data-owner=${$(this).val()}]`);
        $('#proyectos tbody tr').hide();
        rows.show();
    });
}
async function initQC() {
    let t = $('#piezasQC').DataTable({//Inicializar tabla de clientes.
        "ordering": false,
        "createdRow": function (row, data) {
            info = JSON.parse(data[0]);
            $(row).attr("data-prove", info.proveedor);
        }, "columnDefs": [
            {
                "targets": [0],
                "visible": false
            }
        ],
        "searching": false, "bPaginate": false
    });
    let pet = await fetch("clienteNat/0", { headers: { authorization: getCookie("authorization") } });//petición para llenar combo de clientes proveedores
    let clientes = await pet.json();
    $('#in_cliente').append('<option selected value="0"> Sección de cliente...</option>')
    clientes.forEach(cliente => {//Llenado de select con todos lo clientes
        (cliente.estado == 'ACTIVO') ? $('#in_cliente').append(`<option value='${cliente.id_cliente}'>${cliente.nombre}</option>`) : null;
    });
    pet = await fetch('/proveedor', { headers: { authorization: getCookie("authorization") } });//Petición para traer todas las piezas que surte un proveedor
    let partes = await pet.json();
    t.rows().remove().draw();//Quitar todos los elementos de la tabla.
    partes.forEach(parte => {//Agregar las filas con cada parte de cada proveedor a la tabla.
        (parte.estado == 0) ? t.row.add([`{"proveedor":${parte.id_proveedor}}`, parte.interior, parte.exterior, parte.descripcion, `<input type="number" min="0" data-validation="number" data-parte=${parte.interior} data-caja="${parte.caja}" data-pallet="${parte.pallet}" id="cant-${parte.interior}" name="cant_parte" class="form-control cantidad"/>`]).draw() : null;
    });
    $('[data-prove]').hide();
    $('#in_cliente').on('change', async function () {//Evento del select de cliente
        $('#piezasQC tbody tr').hide();
        $(`[data-prove=${$(this).val()}]`).show();
    });
    $('#terminarQC').on('click', async function () {//Enviar todas las filas para realzar movimientos en la base de datos.
        let qc = [];
        info = $("#formQC").serializeObject();
        if (info.id_proveedor != 0) {
            let cantidades = t.$('.cantidad').serialize();//Obtener una cadena con todos los valores de los inputs de cantidades.
            cantidades = cantidades.replace(/cant_parte=/gi, "").split("&");//Quitar de la cadena cant_parte y separarlos por &
            await t.rows().every(async function (rowIdx, tableLoop, rowLoop) { //loop para recorrer toda la tabla
                if (cantidades[rowIdx] > 0) {//Si la cantidad es mayor a 0
                    let d = this.data();
                    qc.push({
                        no_parte: d[1],
                        qc: cantidades[rowIdx]
                    });
                }
            }); info
            info.partes = JSON.parse(JSON.stringify(await qc));

        } else {
            $.notify("Falta Proporcionar Datos Obligatorios y/o Datos Válidos");
        }
        let options = {//opciones para la petición
            method: 'POST',
            body: JSON.stringify(await info),
            headers: { "Content-Type": "application/json", authorization: getCookie("authorization") }
        }
        let pet = await fetch('/qc', options);
        let res = await pet.json();

        if (res.status == 200) {
            $.notify("Quality Control Registrado Correctamente", "success");
            $('#piezasQC').find("input").val("");
        } else if (res.status == 500) {
            $.notify("Ocurrió un error SQL");
        }



    });
}
async function initSVC() {
    let t = $('#piezasQC').DataTable({//Inicializar tabla de clientes.
        "ordering": false,
        "createdRow": function (row, data) {
            info = JSON.parse(data[0]);
            $(row).attr("data-prove", info.proveedor);
        }, "columnDefs": [
            {
                "targets": [0],
                "visible": false
            }
        ],
        "searching": false, "bPaginate": false
    });
    let pet = await fetch("clienteNat/0", { headers: { authorization: getCookie("authorization") } });//petición para llenar combo de clientes proveedores
    let clientes = await pet.json();
    $('#in_cliente').append('<option selected value="0"> Sección de cliente...</option>')
    clientes.forEach(cliente => {//Llenado de select con todos lo clientes
        (cliente.estado == 'ACTIVO') ? $('#in_cliente').append(`<option value='${cliente.id_cliente}'>${cliente.nombre}</option>`) : null;
    });
    pet = await fetch('/proveedor', { headers: { authorization: getCookie("authorization") } });//Petición para traer todas las piezas que surte un proveedor
    let partes = await pet.json();
    t.rows().remove().draw();//Quitar todos los elementos de la tabla.
    partes.forEach(parte => {//Agregar las filas con cada parte de cada proveedor a la tabla.
        (parte.estado == 0) ? t.row.add([`{"proveedor":${parte.id_proveedor}}`, parte.interior, parte.exterior, parte.descripcion, `<input type="number" min="0" data-validation="number" data-parte=${parte.interior} data-caja="${parte.caja}" data-pallet="${parte.pallet}" id="cant-${parte.interior}" name="cant_parte" class="form-control cantidad"/>`]).draw() : null;
    });
    $('[data-prove]').hide();
    $('#in_cliente').on('change', async function () {//Evento del select de cliente
        $('#piezasQC tbody tr').hide();
        $(`[data-prove=${$(this).val()}]`).show();
    });
    $('#terminarQC').on('click', async function () {//Enviar todas las filas para realzar movimientos en la base de datos.
        let qc = [];
        info = $("#formQC").serializeObject();
        if (info.id_proveedor != 0) {
            let cantidades = t.$('.cantidad').serialize();//Obtener una cadena con todos los valores de los inputs de cantidades.
            cantidades = cantidades.replace(/cant_parte=/gi, "").split("&");//Quitar de la cadena cant_parte y separarlos por &
            await t.rows().every(async function (rowIdx, tableLoop, rowLoop) { //loop para recorrer toda la tabla
                if (cantidades[rowIdx] > 0) {//Si la cantidad es mayor a 0
                    let d = this.data();
                    qc.push({
                        no_parte: d[1],
                        qc: cantidades[rowIdx]
                    });
                }
            }); info
            info.partes = JSON.parse(JSON.stringify(await qc));

        } else {
            $.notify("Falta Proporcionar Datos Obligatorios y/o Datos Válidos");
        }
        let options = {//opciones para la petición
            method: 'POST',
            body: JSON.stringify(await info),
            headers: { "Content-Type": "application/json", authorization: getCookie("authorization") }
        }
        let pet = await fetch('/svc', options);
        let res = await pet.json();

        if (res.status == 200) {
            $.notify("Quality Control Registrado Correctamente", "success");
            $('#piezasQC').find("input").val("");
        } else if (res.status == 500) {
            $.notify("Ocurrió un error SQL");
        }
    });
}
function initLogin() {
    $('#login').on('click', async function () {
        let data = {
            correo: $("#usuario").val(),
            pass: $("#pass").val()
        }
        if (data.correo != "" && data.pass != "") {
            let options = {
                method: 'post',
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" }
            }
            let pet = await fetch('/log', options);
            let res = await pet.json();
            if (res.status == 200) {
                setCookie("authorization", res.token);
                localStorage.setItem("lvl", res.lvl);
                if (res.lvl == 3) {
                    window.location.replace("/qc");
                } else {
                    window.location.replace("/inicio");
                }
            } else {
                $.notify(res.message);
            }
        } else {
            $.notify('Falta Ingresar Usuario y/o Contraseña');
        }
    });
    $(document).on('keydown', function (e) {
        if (e.keyCode == 13) {
            $('#login').trigger("click");
        }
    });
}
async function initUsuarios() {
    let tabla = $('#usuarios').DataTable();
    let usuario = {};
    let pet = await fetch('/users', { headers: { authorization: getCookie("authorization") } });
    let res = await pet.json();
    let modales = "";
    for (i in res) {
        let u = res[i];
        tabla.row.add([u.nombre, u.correo, u.nivel, `<button data-target="${u.id_usuario}" type="button" title="Eliminar" class="btn btn-danger eliminar"><span class="fa fa-times"></span></button>`]);
    }
    tabla.draw();
    $('#registroUsuario').on('click', async function () {
        if (usuario.nombre != "" && usuario.correo != "" && usuario.contraseña != "" && usuario.nivel) {
            usuario.nombre = $('#in_nombre').val();
            usuario.correo = $('#usuario').text();
            usuario.contraseña = $('#contraseña').text();
            let options = {
                method: 'post',
                body: JSON.stringify(usuario),
                headers: { "Content-Type": "application/json", authorization: getCookie("authorization") }
            }
            let p = await fetch('/NuevoUsuario', options);
            let a = await p.json();
            if (a.status == 200) {
                $.notify(a.message, "success");
                tabla.row.add([usuario.nombre, usuario.correo, usuario.nivel, `<button data-target="${usuario.id_usuario}" type="button" title="Eliminar" class="btn btn-danger eliminar"><span class="fa fa-times"></span></button>`]).draw();
                $('#AgregarUsuarioModal').modal('toggle');
            } else {
                $.notify(a.message);
            }
        } else {
            $.notify("Falta Proporcionar Datos Obligatorio y/o Válidos");
        }
    });

    $('#in_nombre').on('keyup', function () {
        let nombre = $(this).val().split(" ");
        if (nombre.length > 1) {
            let ingreso = `${nombre[0].substr(0, 1)}${nombre[1]}`.toLowerCase();
            $('#usuario').text(ingreso);
            $('#contraseña').text(ingreso + new Date().getDate() + Math.floor((Math.random() * 100) + 1));
        }
        if (nombre.length >= 3) {
            let ingreso = `${nombre[0].substr(0, 1)}${nombre[1]}${nombre[2]}`.toLowerCase();
            $('#usuario').text(ingreso);
            $('#contraseña').text(ingreso + new Date().getDate() + Math.floor((Math.random() * 100) + 1));
        }
        if (nombre == "") {
            $('#usuario').text("");
            $('#contraseña').text("");
        }
    });

    $('#nivel .nivel').on('click', function () {
        usuario.nivel = $(this).data("value");
    });

    $('.eliminar').on('click', async function () {
        let pet = await fetch('/usuario/' + $(this).data("target"), { method: 'delete', header: { authorization: getCookie("authorization") } });
        let res = await pet.json();
        if (res.status == 200) {
            $.notify(res.message, "success");
            tabla.row($(this).parents('tr')).remove().draw();
        } else {
            $.notify('Ocurrió un Error')
        }
    });


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
    if ("undefined" != typeof $.fn.daterangepicker) {
        var a = function (a, b, c) {
            $("#reportrange span").html(a.format("DD/MMMM/YYYY") + " - " + b.format("DD/MMMM/YYYY"))
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
        $("#reportrange span").html(moment().subtract(29, "days").format("DD/MMMM/YYYY") + " - " + moment().format("DD/MMMM/YYYY")),
            $("#reportrange").daterangepicker(b, a),
            $("#reportrange").on("show.daterangepicker", function () {

            }),
            $("#reportrange").on("hide.daterangepicker", function () {

            }),
            $("#reportrange").on("apply.daterangepicker", async function (a, b) {
                let fecha_inicio = b.startDate.format("DD/MM/YYYY");
                let fecha_final = b.endDate.format("DD/MM/YYYY");
                let data = {};

                if (fecha_inicio == fecha_final) {
                    data.fecha = b.startDate.format("DD/MM/YYYY")

                } else {
                    data.fecha_inicio = b.startDate.format("DD/MM/YYYY");
                    data.fecha_final = b.endDate.format("DD/MM/YYYY");
                }
                let url = "/movimientosFecha"
                let options = {
                    method: 'post',
                    body: JSON.stringify(data),
                    headers: { "Content-Type": "application/json", authorization: getCookie("authorization") }
                }

                let pet = await fetch(url, options);
                let movimientos = await pet.json();
                $('#MovimientosInfo tbody tr').hide();
                movimientos.forEach(movimiento => {
                    $(`[data-id="${movimiento.id_movimiento}"]`).show();
                });
                mov.page.len(-1).draw();

            }),
            $("#reportrange").on("cancel.daterangepicker", function (a, b) {

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
function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + ";";
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}