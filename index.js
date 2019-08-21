var con = require('./conexion.js');
var app = require('./app');

con.connect(function (err) {
    if (err) throw err;
    else
        app.listen(3000, function () {
            console.log("Servidor escuchando en http://localhost:" + 3000);
        });
});
