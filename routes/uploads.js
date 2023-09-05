const { Router } = require('express');
const { check } = require('express-validator');

const { loadFile, updateFile, showImage, updateFileCloudinary } = require('../controllers/uploads');
const { allowedColections } = require('../helpers');
const { validarCampos, validateFile } = require('../middlewares');

const router = Router();

router.post('/',  validateFile, loadFile);

router.put('/:colection/:id', [
    validateFile,
    check('id', 'El id debe ser un id válido de mongo').isMongoId(),
    check('colection').custom( c => allowedColections( c, ['users', 'products'] ) ),
    validarCampos
], updateFileCloudinary);

router.get('/:colection/:id', [
    check('id', 'El id debe ser un id válido de mongo').isMongoId(),
    check('colection').custom( c => allowedColections( c, ['users', 'products'] ) ),
    validarCampos
], showImage);

module.exports = router;