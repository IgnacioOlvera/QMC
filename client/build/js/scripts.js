async function initRecibo() {
    let count = 1;
    let t = $('#piezasRecibo').DataTable({
        "ordering": false
    });
    let tnet = $('#piezasTNET').DataTable({
        "ordering": false
    });
    let pet = await fetch('http://localhost:3000/clienteNat/0');
    let clientes = await pet.json();
    $('#in_cliente').append('<option selected value="0"> Sección de cliente...</option>')
    clientes.forEach(cliente => {
        $('#in_cliente').append(`<option value='${cliente.id_cliente}'>${cliente.nombre}</option>`);
    });
    $('#agregarCostal').on('click', function () {
        let fecha = $('#fecha_recibo').val();
        fecha = fecha.split("/");
        let cod = ("0" + fecha[0]).slice(-2) + ("0" + fecha[1]).slice(-2) + fecha[2].substr(-2) + "-" + ("0" + count).substr(-2);
        tnet.row.add(['<input id="peso" type=number name="peso" class="form-control peso" placeholder="Peso en KG"/>', `<input id="serial" name="serial" class='form-control serial' type='text' value='${cod}'>`]).draw(false);
        count++;
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

    $('#in_cliente').on('change', async function () {
        if ($(this).val() == 4) {
            $('#piezas').hide();
            $('#tablaTNET').show('oculto');
        } else {
            $('#piezas').show('oculto');
            $('#tablaTNET').hide('oculto');
            let pet = await fetch('http://localhost:3000/proveedor/' + $(this).val());
            let partes = await pet.json();
            t.rows().remove().draw();
            partes.forEach(parte => {
                t.row.add([parte.interior, parte.exterior, parte.descripcion, `<input type="text" data-validation="number" data-caja="${parte.caja}" data-pallet="${parte.pallet}" id="cant" name="cant_parte" class="form-control cantidad"/>`, `<label class="cajas">0</label>`, `<label class="pallets">0</label>`]).draw();
            });
            $('.cantidad').on('keyup', function () {
                let cantidad = $(this).val();
                let cant_caja = $(this).data("caja");
                let cant_pallet = $(this).data("pallet");
                let caja = $(this).parent().siblings('td').children(".cajas");
                let pallet = $(this).parent().siblings('td').children(".pallets");
                let tot_cajas = Math.floor(cantidad / cant_caja);
                let tot_pallets = Math.floor(tot_cajas / cant_pallet);
                caja.text(tot_cajas);
                pallet.text(tot_pallets);
            });
        }
    });
    $('#limpiarReciboCostales').click(function () {
        t.rows().remove().draw();
    });
    $('#terminarRecibo').on('click', async function () {
        let cantidades = t.$('.cantidad').serialize();
        cantidades = cantidades.replace(/cant_parte=/gi, "").split("&");
        t.rows().every(async function (rowIdx, tableLoop, rowLoop) {
            if (cantidades[rowIdx] > 0) {
                let a = JSON.stringify($("#form1").serializeObject());
                let data = this.data();
                a = JSON.parse(a);
                a.id_parte = data[0];
                a.cant_parte = cantidades[rowIdx];
                a = JSON.stringify(a);
                let options = {
                    method: 'POST',
                    body: a,
                    headers: { "Content-Type": "application/json" }
                }
                let c = await fetch('http://localhost:3000/entradas', options);
                let res = await c.json();
                t.$('.cantidad').val("");
                $.notify(res.message);
            }
        });
    });

    $('#terminarReciboCostales').on('click', function () {
        let pesos = tnet.$('.peso').serialize().replace(/peso=/gi, "").split("&");
        let seriales = tnet.$('.serial').serialize().replace(/serial=/gi, "").split("&");
        tnet.rows().every(async function (rowIdx, tableLoop, rowLoop) {
            let a = $("#form1").serializeObject();
            let data = this.data();
            a.secuencia = seriales[rowIdx];
            a.id_parte = "5";
            a.cant_parte = "1";
            a = JSON.stringify(a);
            let options = {
                method: 'POST',
                body: a,
                headers: { "Content-Type": "application/json" }
            }
            let c = await fetch('http://localhost:3000/entradas', options);
            let res = await c.json();
            $.notify(res.message, "success");

        });
    });
}
async function initEnvios() {
    let t = $('#piezasRecibo').DataTable({
        "ordering": false
    });
    let pet = await fetch('http://localhost:3000/clienteNat/0');
    let clientes = await pet.json();
    $('#in_cliente').append('<option selected> Sección de cliente...</option>')
    clientes.forEach(cliente => {
        $('#in_cliente').append(`<option value='${cliente.id_cliente}'>${cliente.nombre}</option>`);
    });

    pet = await fetch('http://localhost:3000/parte');
    let partes = await pet.json();
    $('#in_parte').append('<option selected> Sección de piezas...</option>')
    partes.forEach(parte => {
        $('#in_parte').append(`<option value='${parte.id_parte}'>${parte.no_parte}-${parte.descripcion}</option>`);
    });
    let url = `http://localhost:3000/clienteNat/1`
    pet = await fetch(url)
    clientes = await pet.json();
    $('#in_clienteDest').append('<option selected> Sección de cliente...</option>')
    clientes.forEach(cliente => {
        $('#in_clienteDest').append(`<option value='${cliente.id_cliente}'>${cliente.nombre}</option>`);
    });
    $("#fecha_recibo").daterangepicker({
        singleDatePicker: !0,
        singleClasses: "picker_4"
    }, function (a, b, c) {
        //console.log(a.toISOString(), b.toISOString(), c)
    });

    $('#in_cliente').on('change', async function () {
        let pet = await fetch('http://localhost:3000/proveedor/' + $(this).val());
        let partes = await pet.json();
        t.rows().remove().draw();
        partes.forEach(parte => {
            t.row.add([parte.interior, parte.exterior, parte.descripcion, `<input type="text" data-validation="number" data-caja="${parte.caja}" data-pallet="${parte.pallet}" id="cant" name="cant_parte" class="form-control cantidad"/>`, `<label class="cajas">0</label>`, `<label class="pallets">0</label>`]).draw();
        });

        $('.cantidad').on('keyup', function () {
            let cantidad = $(this).val();
            let cant_caja = $(this).data("caja");
            let cant_pallet = $(this).data("pallet");
            let caja = $(this).parent().siblings('td').children(".cajas");
            let pallet = $(this).parent().siblings('td').children(".pallets");
            let tot_cajas = Math.floor(cantidad / cant_caja);
            let tot_pallets = Math.floor(tot_cajas / cant_pallet);
            caja.text(tot_cajas);
            pallet.text(tot_pallets);
        });
    });

    $('#limpiarRecibo').click(function () {
        t.rows().remove().draw();
    });

    $('#terminarRecibo').on('click', async function () {
        let cantidades = t.$('.cantidad').serialize();
        cantidades = cantidades.replace(/cant_parte=/gi, "").split("&");
        t.rows().every(async function (rowIdx, tableLoop, rowLoop) {
            if (cantidades[rowIdx] > 0) {
                let a = JSON.stringify($("#form1").serializeObject());
                let data = this.data();
                console.log(rowIdx);
                a = JSON.parse(a);
                a.id_parte = data[0];
                a.cant_parte = cantidades[rowIdx];
                a = JSON.stringify(a);
                let options = {
                    method: 'POST',
                    body: a,
                    headers: { "Content-Type": "application/json" }
                }
                let c = await fetch('http://localhost:3000/entradas', options);
                let res = await c.json();
                t.$('.cantidad').val("");
                alert(res.message);
            }
        });
    });
}

(function ($) {
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

