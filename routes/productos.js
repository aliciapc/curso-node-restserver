const {Router} = require('express');
const {check} = require('express-validator');

const {validarJWT, validarCampos, esAdminRole} = require('../middlewares');

const { 
    crearProducto, 
    obtenerListadoProducto,
    obtenerProductoId, 
    actualizarProducto,
    borrarProducto
} = require('../controllers/productos');

const { existeProducto, existeCategoria } = require('../helpers/db-validators');

const router = Router();

/**
 * Esto apunta al {{url}}/api/Productos
 */

//Obtener todas las Productos - acceso público
router.get('/',obtenerListadoProducto);

//Obtener una Producto por id - público
router.get('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], obtenerProductoId);

//Crear una Producto - privado con cualquier persona con un token válido
router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un ID válido').isMongoId(),
    check('categoria').custom(existeCategoria),
    validarCampos
    ],crearProducto);


//Actualizar un registro por id - privado con cualquier persona con un token válido
router.put('/:id',[
    validarJWT,
    check('id').custom(existeProducto),
    validarCampos
], actualizarProducto);

//Borrar una Producto - sólo si es admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
] ,borrarProducto);

module.exports = router;