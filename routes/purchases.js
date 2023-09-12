const { Router } = require('express');
const { check } = require('express-validator');

const {
    validarCampos, 
    validarJWT,
} = require('../middlewares');
const {
    productExistById, 
    companyExistsById,
    supplierExistsById,
    purchaseExistById} = require('../helpers/db-validators');
const { createPurchase, getCompanyPurchases, getPurchase } = require('../controllers/purchase');

const router = Router();

/**
 *  {{ url }}/api/purchases
 */

// Obtener todas las purchases de X compañía - privado - cualquier persona con token válido
router.get('/company/:companyId', [
        validarJWT,
        check('companyId', 'No es un id válido').isMongoId(),
        check('companyId').custom( companyExistsById ),
        validarCampos
    ], getCompanyPurchases);

// Obtener una purchase por id - privado - cualquier persona con token válido
router.get('/:id', [
        validarJWT,
        check('id', 'No es un id válido').isMongoId(),
        check('id').custom( purchaseExistById ),
        validarCampos
    ], getPurchase);

// TODO: Agregar lógica de modificar el stock y mandar el precio correcto en el frontend
// Crear registro de compra - privado - cualquier persona con token válido
router.post('/', [
        validarJWT,
        check('supplier', 'No es un id válido').isMongoId(),
        check('supplier').custom( supplierExistsById ),
        check('product', 'No es un id válido').isMongoId(),
        check('product').custom( productExistById ),
        check('price').isNumeric(false),
        check('amount').isNumeric(false),
        validarCampos,
    ], createPurchase);

module.exports = router;