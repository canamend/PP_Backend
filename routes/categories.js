const { Router } = require('express');
const { check } = require('express-validator');

const {
        validarCampos, validarJWT, validarCategoryId, isAdminRole
} = require('../middlewares');
const { createCategory,
        getCategories,
        getCategory,
        updateCategory, 
        deleteCategory} = require('../controllers/categories');
const { categoryExistById } = require('../helpers/db-validators');


const router = Router();

/**
 *  {{ url }}/api/categorias
 */

// Obtener todas las categorias - publico
router.get('/', getCategories);

// Obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom( categoryExistById ),
    validarCampos,
], getCategory);

// Crear categoria - privado - cualquier persona con token válido
router.post('/', [ 
        validarJWT,
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        validarCampos
    ], createCategory);

// Actualizar una categoria por id - privado - cualquiera con token
router.put('/:id', [
    validarJWT,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom( categoryExistById ),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,
], updateCategory );

// Delete una categoria por id - privado - solo admin
router.delete('/:id', [
    validarJWT,
    isAdminRole,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom( categoryExistById ),
    validarCampos,
], deleteCategory);




module.exports = router;