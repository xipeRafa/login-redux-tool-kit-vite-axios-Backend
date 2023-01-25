const { response } = require('express');
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

// el controlador valida contra la base de datos

const login = async(req, res = response) => {


    const { correo, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ correo }); // Verificar si el email existe
        if ( !usuario ) {
            return res.status(400).json({errors:[{msg: 'Usuario no existe - correo --- controller'}]});
        }
      // errors:[{     }]
        if ( !usuario.estado ) {  // SI el usuario está activo
            return res.status(400).json({errors:[{ msg: ' - estado: false --- controller'}]});
        }

        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if ( !validPassword ) {
            return res.status(400).json({errors:[{ msg: 'Password no son correctos - password --- controller'}]});
        }

        const token = await generarJWT( usuario.id );

        res.json({ usuario, token})

    } catch (error) {
        console.log(error)
        res.status(500).json({errors:[{ msg: 'Hable con el administrador --- controller' }]});
    }   

}

 

const googleSignin = async(req, res = response) => {

    const { id_token } = req.body;
    
    try {
        const { correo, nombre, img } = await googleVerify( id_token );

        let usuario = await Usuario.findOne({ correo });

        if ( !usuario ) {
          
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };  // Tengo que crearlo

            usuario = new Usuario( data );
            await usuario.save();
        }

        // Si el usuario en DB
        if ( !usuario.estado ) {
            return res.status(401).json({errors:[{msg: 'Hable con el administrador, usuario bloqueado --- controller'}]});
        }

        const token = await generarJWT( usuario.id );
        
        res.json({ usuario, token });
        
    } catch (error) {
        res.status(400).json({ errors:[{msg: 'Token de Google no es válido --- controller'}]})
    }
}


const revalidarToken = async (req, res = response ) => {

    const { _id:uid, nombre } = req.usuario;
    console.log('req.usuario', req.usuario)
    const token = await generarJWT( uid, nombre );  // Generar JWT

    res.json({ ok: true, uid, nombre, token })
}



module.exports = {
    login,
    googleSignin,
    revalidarToken
}
