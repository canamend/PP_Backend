const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const { validarCampos, validarJWT, isAdminRole } = require('../middlewares');
const { postSupplier, getCompanySuppliers, putSupplier, getSupplier, deleteSupplier } = require('../controllers/supplier');
const { companyExistsById, phoneExists, supplierExistsById } = require('../helpers');

router.get('/company/:companyId', [     
        check('companyId', 'No es un id válido').isMongoId(),
        check('companyId').custom( companyExistsById ),
        validarCampos
    ], getCompanySuppliers);

router.get('/:id', [
        check('id', 'No es un id válido').isMongoId(),
        check('id').custom( supplierExistsById ),
        validarCampos
    ], getSupplier);

router.post('/', [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('name', 'El nombre tiene que tener una longitud de al menos 10 caracteres').isLength({ min: 10 }),
        check('email','El correo no es válido').isEmail(),
        check('phoneNumber').custom((phoneNumber) => phoneExists(phoneNumber, 'suppliers') ),
        check('phoneNumber').isMobilePhone('es-MX'),
        check('company', 'No es un id válido').isMongoId(),
        check('company').custom( companyExistsById ),
        validarCampos
    ], postSupplier);

router.put('/:id', [        
        check('id', 'No es un id válido').isMongoId(),
        check('id').custom( supplierExistsById ),
        check('email', 'El correo no es válido').isEmail(),
        check('name', 'El nombre del proveedor tiene que tener al menos 10 caracteres').isLength({ min: 10 }),
        check('phoneNumber').isMobilePhone('es-MX'),
        validarCampos
    ], putSupplier );

router.delete('/:id', [
        validarJWT,
        isAdminRole,
        check('id', 'No es un id válido').isMongoId(),
        check('id').custom( supplierExistsById ),
        validarCampos
    ], deleteSupplier );

module.exports = router;

