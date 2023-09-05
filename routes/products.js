const { Router } = require('express');
const { check } = require('express-validator');

const {
        validarCampos, 
        validarJWT, 
        isAdminRole
} = require('../middlewares');
const { categoryExistById, 
        productExists, 
        productExistById } = require('../helpers/db-validators');
const { createProduct, 
        getProducts, 
        getProduct, 
        updateProduct, 
        deleteProduct } = require('../controllers/products');


const router = Router();

/**
 *  {{ url }}/api/categorias
 */

// Obtener todas las categorias - publico
router.get('/', getProducts);

// Obtener una categoria por id - publico
router.get('/:id', [
        check('id', 'No es un id válido').isMongoId(),
        check('id').custom( productExistById ),
        validarCampos
    ], getProduct);

// Crear categoria - privado - cualquier persona con token válido
router.post('/', [
        validarJWT,
        check('name', 'El nombre del producto es obligatorio').not().isEmpty(),
        check('name').custom( productExists ),
        check('category', 'No es un id válido').isMongoId(),
        check('category').custom( categoryExistById ),
        validarCampos,
    ], createProduct);

// Actualizar una categoria por id - privado - cualquiera con token
router.put('/:id', [
        validarJWT,
        check('id', 'No es un id válido').isMongoId(),
        check('id').custom( productExistById ),
        validarCampos
    ], updateProduct);

// Delete una categoria por id - privado - solo admin
router.delete('/:id',  [
    validarJWT,
    isAdminRole,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom( productExistById ),
    validarCampos,
], deleteProduct);




module.exports = router;