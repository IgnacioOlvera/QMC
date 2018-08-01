var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_curso';


exports.ensureAuth = function (req, res, next) {
    if (!req.cookies.authorization) {
        res.redirect('/login');
        //return res.status(403).send({ message: 'La petición no tiene la cabecera de autenticacion' });
        return;
    }

    var token = req.cookies.authorization.replace(/['"]+/g, '');

    try {
        var payload = jwt.decode(token, secret);
        if (payload.exp <= moment().unix) {
            res.redirect('/login');
            //return res.status(401).send({ message: 'Token ha expirado' });
            return;
        }
    } catch (ex) {
        //console.log(ex);
        res.redirect('/login');
        //return res.status(403).send({ message: 'Token no válido' });
        return;
    }

    req.usuario = payload;
    next();
}
