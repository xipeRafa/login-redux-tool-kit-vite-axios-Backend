const { Router } = require('express');
const { check } = require('express-validator');


const { validarCampos } = require('../middlewares');


const { login, googleSignin, revalidarTokenContoller } = require('../controllers/auth');
const { revalidarJWT } = require('../middlewares/revalidarJWT');
/*  const { revalidarJWT } = require('../middlewares/revalidarJWT');  */


const router = Router();

router.get('/renew', revalidarTokenContoller); 

router.post('/login',[
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
],login );

router.post('/google',[
    check('id_token', 'El id_token es necesario').not().isEmpty(),
    validarCampos
], googleSignin );



module.exports = router;