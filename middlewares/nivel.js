var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_curso';

function ensureLevel1(req, res, next) {
    //Tiene Acceso a todo el sistema
    var token = req.cookies.authorization, payload = "";
    try {
        payload = jwt.decode(token, secret);
        if (payload.nivel != 1) {
            res.redirect('/login');
            return;

        }
    } catch (ex) {
        res.redirect('/inicio');
        return;
    }
    next();
}

function ensureLevel2(req, res, next) {
    //Tiene Acceso a todo el sistema
    try {
        var token = req.cookies.authorization, payload = "";
        payload = jwt.decode(token, secret);
        if (payload.nivel > 2) {
            res.redirect('/login');
            return;
        }
    } catch (ex) {
        res.redirect('/inicio');
        return;
    }
    next();
}

module.exports = {
    ensureLevel1,
    ensureLevel2
}