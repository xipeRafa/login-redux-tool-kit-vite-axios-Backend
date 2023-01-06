

const validaCampos = require('../middlewares/validar-campos');
const validarJWT   = require('./validarjwt');
const validaRoles  = require('../middlewares/validar-roles');
const validarArchivo = require('../middlewares/validar-archivo');

module.exports = {
    ...validaCampos,
    ...validarJWT,
    ...validaRoles,
    ...validarArchivo
}