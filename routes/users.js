const { Router } = require('express');
const { check } = require('express-validator');

const {
        validarCampos, 
        validarJWT,
        hasRole,
        isAdminRole,
} = require('../middlewares');
const { isRoleValid, emailExists, userExistsById, phoneExists, companyExistsById } = require('../helpers/db-validators');

const Role = require('../models/role')
const router = Router();

const { usersGet, 
        usersPut, 
        usersPost, 
        usersDelete } = require('../controllers/users');

router.get('/', usersGet);

router.put('/:id', [
        check('id', 'No es un id válido').isMongoId(),
        check('id').custom( userExistsById ),
        check('role').custom( isRoleValid ),
        check('email', 'El correo no es válido').isEmail(),
        check('name', 'El nombre de la compañía tiene que tener al menos 4 caracteres').isLength({ min: 4 }),
        check('phoneNumber').isMobilePhone('es-MX'),
        validarCampos
], usersPut);

router.post('/',[
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'La contraseña debe ser mayor a 6 caracteres').isLength({ min: 6 }),
        check('email', 'El correo no es válido').isEmail(),
        check('email').custom( emailExists ),
        check('role').custom( (role) => isRoleValid(role) ), //* El parametro de custom() puede ser únicamente el nombre de la función isRoleValid
                                                             //* ya que el callback y el argumento que se envía a la función son los mismos
        check('phoneNumber').custom((phoneNumber) => phoneExists(phoneNumber, 'users') ),
        check('phoneNumber').isMobilePhone('es-MX'),
        check('company', 'No es un id válido').isMongoId(),
        check('company').custom( companyExistsById ),
        validarCampos
], usersPost);

router.delete('/:id', [
        validarJWT,
        isAdminRole,
        check('id', 'No es un id válido').isMongoId(),
        check('id').custom( userExistsById ),
        validarCampos
], usersDelete);

module.exports = router;