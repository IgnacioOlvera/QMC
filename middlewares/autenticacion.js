var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_curso';
var token = "", payload = "";


exports.ensureAuth = function (req, res, next) {
    
    try {
        console.log(req.cookies.authorization)
        if (!req.cookies.authorization) {
            res.redirect('/login');
            console.log("no hay auto");
            return;
        }
    } catch (ex) {
        console.log(ex);
    }
    token = req.cookies.authorization.replace(/['"]+/g, '');
    try {
        console.log("try");
        payload = jwt.decode(token, secret);
        if (payload.exp <= moment().unix) {
            res.redirect('/login');
            return;
        } else {
            console.log("pasa");
        }
    } catch (ex) {
        console.log(ex);
        res.redirect('/login');
        return;
    }
    req.usuario = payload;
    next();
}
