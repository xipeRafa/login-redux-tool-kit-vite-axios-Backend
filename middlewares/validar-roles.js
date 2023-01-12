const { response } = require('express')



const esAdminRole = ( req, res = response, next ) => {

    if ( !req.usuario ) {
        return res.status(500).json({errors:[{msg: 'Se quiere verificar el role sin validar el token primero --- middlewares'}]});
    }

    const { rol, nombre } = req.usuario;
    
    if ( rol !== 'ADMIN_ROLE' ) {
        return res.status(401).json({errors:[{msg: `${ nombre } no es administrador - No puede hacer esto --- middlewares`}]});
    }

    next();
}



const tieneRole = ( ...roles  ) => {
    return (req, res = response, next) => {
        
        if ( !req.usuario ) {
            return res.status(500).json({errors:[{msg: 'Se quiere verificar el role sin validar el token primero --- middlewares'}]});
        }

        if ( !roles.includes( req.usuario.rol ) ) {
            return res.status(401).json({errors:[{msg: `El servicio requiere uno de estos roles ${ roles } --- middlewares`}]});
        }


        next();
    }
}



module.exports = {
    esAdminRole,
    tieneRole
}