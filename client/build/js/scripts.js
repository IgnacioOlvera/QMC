//import '../../build/js/jquery-3.3.1.js';
let t = $('#piezasRecibo').DataTable();
async function init() {
    let pet = await fetch('http://localhost:3000/cliente');
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
    })

}
$("#piezasRecibo").DataTable();
$("#fecha_recibo").daterangepicker({
    singleDatePicker: !0,
    singleClasses: "picker_4"
}, function (a, b, c) {
    console.log(a.toISOString(), b.toISOString(), c)
});
$('in_cliente').on('change',async function(){
    let pet=await fetch(`http://localhost:3000/proveedor/${$(this).val()}`);
    let data = await pet.json();
    console.log(data);
});
$('#agregarRecibo').on('click', function () {
    let data = $('#form1').serializeObject();
    let cliente = $('#in_cliente option:selected').text();
    if (cliente != "" && data.id_parte != "" && data.cant_parte != "" && data.fecha != "") {
        let d = [cliente, data.id_parte, data.cant_parte, data.fecha, data.id_contenedor, data.id_candado, data.secuencia, '<button style="border:none; background: transparent;"><span class="fa fa-remove del"></span></button>'];
        t.row.add(d).node().id = data.id_proveedor;
        t.draw(false);
    }
});

$('#piezasRecibo tbody').on('click', '.del', function () {
    let tr = $($($($(this).parent()).parent())).parent();
    if (tr.hasClass('selected')) {
        tr.removeClass('selected');
    }
    else {
        tr.addClass('selected');
    }
});

$('#eliminarRecibo').click(function () {
    t.rows('.selected').remove().draw();
});
$('#limpiarRecibo').click(function () {
    t.rows().remove().draw();
});

$('#terminarRecibo').on('click', async function () {
    /*let a = JSON.stringify($("#form1").serializeObject());
    let options = {
        method:'POST',
        body: a,
        headers: { "Content-Type": "application/json" }
    }
    let c = await fetch('http://localhost:3000/entradas', options);
    let res = await c.json();
    alert(res.message);*/
    t.rows().every(function (rowIdx, tableLoop, rowLoop) {
        var data = this.data();
        console.log(data);
    });

});
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

