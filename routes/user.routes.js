const {Router} = require('express');
const {check} = require('express-validator');

const {validarCampos} = require('../middlewares/validar-campos')
const { esRolValido, emailExiste, existeUsuarioId } = require('../helpers/db-validators');

const {
    usersGet, 
    usersPost, 
    usersPut, 
    usersPatch, 
    usersDelete
} = require('../controllers/users.controllers');




const router = Router();

router.get('/', usersGet );
router.post('/', [
    //es un middleware. Podemos especificar que campos del body necesitamos validar
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser superior a 6 letras').isLength({min: 6}),
    //check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom(emailExiste),
    //check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom(esRolValido),
    //este middleware va a ser colocado después de todas las validaciones del check
    //una vez que tengamos hechas todas las validaciones, 
    //ejecutaremos la que va a revisar los errores de cada uno de ellos
    validarCampos
] ,usersPost );

router.put('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioId),
    check('rol').custom(esRolValido),
    validarCampos
] ,usersPut );


router.patch('/', usersPatch );

router.delete('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioId),
    validarCampos
] ,usersDelete );


module.exports = router;