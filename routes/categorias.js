const {Router} = require('express');
const {check} = require('express-validator');

const {validarJWT, validarCampos, esAdminRole} = require('../middlewares');

const { 
    crearCategoria, 
    obtenerListadoCategoria,
    obtenerCategoriaId, 
    actualizarCategoria,
    borrarCategoria
} = require('../controllers/categorias');

const { existeCategoria } = require('../helpers/db-validators');

const router = Router();

/**
 * Esto apunta al {{url}}/api/categorias
 */

//Obtener todas las categorias - acceso público
router.get('/',obtenerListadoCategoria);

//Obtener una categoria por id - público
router.get('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
] ,obtenerCategoriaId);

//Crear una categoria - privado con cualquier persona con un token válido
router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
    ],crearCategoria);


//Actualizar un registro por id - privado con cualquier persona con un token válido
router.put('/:id',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
] ,actualizarCategoria);

//Borrar una categoria - sólo si es admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
] ,borrarCategoria);

module.exports = router;