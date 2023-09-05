
const validaCampos = require('../middlewares/validar-campos');
const validaJWT = require('../middlewares/validar-jwt');
const validaRoles = require('../middlewares/validar-roles');
const validateFile = require('../middlewares/validar-file');

module.exports = {
    ...validaCampos,
    ...validaJWT,
    ...validaRoles,
    ...validateFile
}
