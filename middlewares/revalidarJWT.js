const { response } = require('express');
const jwt = require('jsonwebtoken');

const revalidarJWT = ( req, res = response, next ) => {
console.log('revalidarJWT')
    // x-token headers
    const token = req.header('token');

    if ( !token ) {
        return res.status(401).json({ok: false, msg: 'No hay token en la petición'});
    }

    try {
        
        const { uid, nombre } = jwt.verify(token, process.env.SECRET_JWT_SEED );

        req.uid = uid;
        req.nombre = nombre;

    } catch (error) {
        return res.status(401).json({ ok: false, msg: 'Token no válido'});
    }

    next();
}

module.exports = { revalidarJWT }