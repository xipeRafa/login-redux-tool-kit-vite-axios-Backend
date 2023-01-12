const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { crearProducto,
        obtenerProductos,
        obtenerProducto,
        actualizarProducto, 
        borrarProducto,
        productosToggle } = require('../controllers/productos');

const { existeCategoriaPorId, existeProductoPorId, nombreRepetido } = require('../helpers/db-validators');

const router = Router();

/**
 * {{url}}/api/categorias
 */

//  Obtener todas las categorias - publico
router.get('/', obtenerProductos );

// Obtener una categoria por id - publico
router.get('/:id',[
    check('id', 'No es un id de Mongo válido --- routes').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos,
], obtenerProducto );

// Crear categoria - privado - cualquier persona con un token válido
router.post('/', [ 
    validarJWT,
    check('nombre').custom(nombreRepetido),
   /*  check('nombre','El nombre es obligatorio --- routes').not().isEmpty(), */
    /* check('categoria','No es un id de Mongo en Categorias --- routes').isMongoId(), */
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos,
], crearProducto );

// Actualizar - privado - cualquiera con token válido
router.put('/:id',[
    validarJWT,
     //check('categoria','No es un id de Mongo --- routes').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], actualizarProducto );

// Borrar una categoria - Admin
router.delete('/:id',[
    validarJWT,
    /* esAdminRole, */
    check('id', 'No es un id de Mongo válido --- routes').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos,
], borrarProducto);

router.patch('/toggle/:id',[
    validarJWT, 
    // esAdminRole,
  /*    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE','USER_ROLE'), 
    check('id', 'No es un ID válido --- routes').isMongoId(),
    check('id').custom( existeUsuarioPorId ), */
    validarCampos
],productosToggle );


module.exports = router;