const { Router } = require('express');
const { check } = require('express-validator');

const {
        validarCampos, 
        validarJWT,
        hasRole,
        isAdminRole,
} = require('../middlewares');
const { isRoleValid, emailExists, userExistsById } = require('../helpers/db-validators');

const Role = require('../models/role')
const router = Router();

const { usersGet, 
        usersPatch, 
        usersPut, 
        usersPost, 
        usersDelete } = require('../controllers/users');

router.get('/', usersGet);

router.put('/:id', [
        check('id', 'No es un id válido').isMongoId(),
        check('id').custom( userExistsById ),
        check('role').custom( isRoleValid ),
        validarCampos
], usersPut);

router.post('/',[
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'La contraseña debe ser mayor a 6 caracteres').isLength({ min: 6 }),
        check('email', 'El correo no es válido').isEmail(),
        check('email').custom( emailExists ),
        check('role').custom( (role) => isRoleValid(role) ), //* El parametro de custom() puede ser únicamente el nombre de la función isRoleValid
                                                             //* ya que el callback y el argumento que se envía a la función son los mismos
        validarCampos
], usersPost);

router.delete('/:id', [
        validarJWT,
        // isAdminRole,
        hasRole('ADMIN_ROLE', 'VENTAS_ROLE'),
        check('id', 'No es un id válido').isMongoId(),
        check('id').custom( userExistsById ),
        validarCampos
], usersDelete);

router.patch('/', usersPatch);


module.exports = router;