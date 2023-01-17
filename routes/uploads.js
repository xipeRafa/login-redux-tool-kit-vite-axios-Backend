const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarArchivoSubir } = require('../middlewares');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');


const router = Router();


router.post( '/server', validarArchivoSubir, cargarArchivo );

router.get('/server', [
    /* check('id','El id debe de ser de mongo --- routes').isMongoId(), */
    /* validarCampos */
], mostrarImagen  )




router.post('/:coleccion/:id', [
    validarArchivoSubir,
/*     check('id','El id debe de ser de mongo --- routes').isMongoId(),
 */    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios','productos'] ) ),
    validarCampos
 ], actualizarImagen )




 router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id','El id debe de ser de mongo --- routes').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios','productos'] ) ),
    validarCampos
], actualizarImagenCloudinary )


router.get('/:coleccion/:id', [
    check('id','El id debe de ser de mongo --- routes').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios','productos'] ) ),
    validarCampos
], mostrarImagen  )



module.exports = router;