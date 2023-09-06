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
const { companyExistsById, phoneExists, nameExists, addressExists } = require('../helpers/db-validators');
const { createCompany, getCompanies, getCompany, updateCompany, deleteCompany } = require('../controllers/companies');
const { validateDuplicatedCompanyData } = require('../middlewares/validate-duplicated');


const router = Router();

/**
 *  {{ url }}/api/compañías
 */

// Obtener todas las compañías - publico
router.get('/', getCompanies);

// Obtener una comapañía por id - publico
router.get('/:id', [
        check('id', 'No es un id válido').isMongoId(),
        check('id').custom( companyExistsById ),
        validarCampos
    ], getCompany );

// Crear comapañía - privado - cualquier persona con token válido
router.post('/', [
        check('name').custom( (name) => nameExists(name, 'companies') ),
        check('name', 'El nombre de la compañía tiene que tener al menos 4 caracteres').isLength({ min: 4 }),
        check('phoneNumber').isMobilePhone('es-MX'),
        check('phoneNumber').custom( (phoneNumber) => phoneExists(phoneNumber, 'companies') ),
        check('address', 'La dirección tiene que tener al menos 15 caracteres').isLength({ min: 15 }),
        check('address').custom( (address) => addressExists(address, 'companies') ),
        validarCampos
    ], createCompany);

// Actualizar una comapañía por id - privado - cualquiera con token de administrador
router.put('/:id', [
        validarJWT,
        check('id', 'No es un id válido').isMongoId(),
        check('id').custom( companyExistsById ),
        check('name', 'El nombre de la compañía tiene que tener al menos 4 caracteres').isLength({ min: 4 }),
        check('phoneNumber').isMobilePhone('es-MX'),
        check('address', 'La dirección tiene que tener al menos 15 caracteres').isLength({ min: 15 }),
        isAdminRole,
        validarCampos
    ], updateCompany);

// Delete una comapañía por id - privado - solo admin
router.delete('/:id', [
        validarJWT,
        check('id', 'No es un id válido').isMongoId(),
        check('id').custom( companyExistsById ),
        isAdminRole,
        validarCampos
    ], deleteCompany);




module.exports = router;