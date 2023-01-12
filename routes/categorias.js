const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { crearCategoria,
        obtenerCategorias,
        obtenerCategoria,
        actualizarCategoria, 
        borrarCategoria, 
        categoriasToggle} = require('../controllers/categorias');
        
const { existeCategoriaPorId } = require('../helpers/db-validators');

const router = Router();

/**
 * {{url}}/api/categorias
 */

//  Obtener todas las categorias - publico
router.get('/', obtenerCategorias );

// Obtener una categoria por id - publico
router.get('/:id',[
    check('id', 'No es un id de Mongo válido --- routes').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos,
], obtenerCategoria );

// Crear categoria - privado - cualquier persona con un token válido
router.post('/', [ 
    validarJWT,
    check('nombre','El nombre es obligatorio -- routes').not().isEmpty(),
    validarCampos
], crearCategoria );

// Actualizar - privado - cualquiera con token válido
router.put('/:id',[
    validarJWT,
    check('nombre','El nombre es obligatorio --- routes').not().isEmpty(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
],actualizarCategoria );

// Borrar una categoria - Admin
router.delete('/:id',[
    validarJWT,
    /* esAdminRole, */
    check('id', 'No es un id de Mongo válido --- routes').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos,
],borrarCategoria);


router.patch('/toggle/:id',[
    validarJWT, 
    // esAdminRole,
  /*    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE','USER_ROLE'), 
    check('id', 'No es un ID válido --- routes').isMongoId(),
    check('id').custom( existeUsuarioPorId ), */
    validarCampos
],categoriasToggle );



module.exports = router;