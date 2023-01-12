const { Router } = require('express');
const { check } = require('express-validator');


const { validarCampos, validarJWT } = require('../middlewares');


const { login, googleSignin, revalidarToken } = require('../controllers/auth');


// check valida contra el frontend

const router = Router();

router.post('/login',[
    check('correo', 'El correo no es válido o vacio --- routes').isEmail(),
    check('correo', 'El correo es obligatorio --- routes').isEmail(),
    check('password', 'La contraseña es obligatoria --- routes').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 letras --- routes').isLength({ min: 6 }),
    validarCampos
],login );

router.post('/google',[
    check('id_token', 'El id_token es necesario --- routes').not().isEmpty(),
    validarCampos
], googleSignin );

router.get('/renew', validarJWT , revalidarToken);


module.exports = router;