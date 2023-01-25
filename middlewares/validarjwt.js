const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');



const validarJWT = async( req = request, res = response, next ) => {

    console.log('req-body :>>>>>', req.body)
    console.log('req-headers :>>>>>', req.headers)
    console.log('req-headers :>>>>>', req.header('token'))

    const token = req.header('token');
    if ( !token ) {
        return res.status(401).json({ errors:[{msg: 'No hay token en la petición --- middlewares'}]});
    }

    try {
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        const usuario = await Usuario.findById( uid );   // leer el usuario que corresponde al uid

        if( !usuario ) {
            return res.status(401).json({ errors:[{msg: 'Token no válido - usuario no existe DB --- middlewares'}]})
        }

        if ( !usuario.estado ) {
            return res.status(401).json({ errors:[{msg: 'Token no válido - usuario con estado: false --- middlewares'}]})  // Verificar si el uid tiene estado true
        }
        
        req.usuario = usuario;
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({errors:[{ msg: 'Token no válido --- middlewares'}] })
    }

}




module.exports = { validarJWT }