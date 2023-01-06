const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');


const validarJWT = async( req = request, res = response, next ) => {

    const token = req.header('token');
    if ( !token ) {
        return res.status(401).json({ msg: 'No hay token en la petición'});
    }

    try {
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        const usuario = await Usuario.findById( uid );   // leer el usuario que corresponde al uid

        if( !usuario ) {
            return res.status(401).json({ msg: 'Token no válido - usuario no existe DB'})
        }

        if ( !usuario.estado ) {
            return res.status(401).json({ msg: 'Token no válido - usuario con estado: false'})  // Verificar si el uid tiene estado true
        }
        
        req.usuario = usuario;
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({ msg: 'Token no válido' })
    }

}

module.exports = { validarJWT }