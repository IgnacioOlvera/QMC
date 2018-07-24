var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_curso';
exports.createToken = function (user) {
    var payload = {
        id: user.id_usuario,
        nombre: user.nombre,
        correo: user.correo,
        nivel: user.nivel,
        pass: user.pass,
        iat: moment().unix(),
        exp: moment().add(8, 'hours').unix()
    };
    return jwt.encode(payload, secret);
}