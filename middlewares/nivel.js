var jwt = require('jwt-simple');
var secret = 'clave_secreta_curso';

function ensureLevel1(req, res, next) {
    //Tiene Acceso a todo el sistema
    var token = req.headers.authorization;
    try {
        var payload = jwt.decode(token, secret);
        if (payload.nivel != 1) {
            return res.send(`<h1>No tiene autorización para acceder a estos métodos</h1>`);
        }
    } catch (ex) {
        return res.send("<h1>No tiene autorización para acceder a estos métodos</h1>");
    }
    next();
}

function ensureLevel2(req, res, next) {
    //Tiene Acceso a todo el sistema
    try {
        var token = req.headers.authorization;
        var payload = jwt.decode(token, secret);
        if (payload.nivel > 2) {
            return res.send("<h1>No tiene autorización para acceder a estos métodos</h1>");
        }
    } catch (ex) {
        return res.send("<h1>No tiene autorización para acceder a estos métodos</h1>");
    }
    next();
}


module.exports = {
    ensureLevel1,
    ensureLevel2
}