const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');




const usuariosGet = async(req = request, res = response) => {

    const { from, limit } = req.params
    
    const query = { estado: true };

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query).skip(Number(from)).limit(Number(limit))
    ]);

    res.json({ total, usuarios });
}






const usuariosPost = async(req, res = response) => {
    
    const { nombre, correo, password, rol } = req.body;

    try {// errors:[{     }]
        let usuario = await Usuario.findOne({ correo }); // validar si existe usuario
        if ( usuario ) {
            return res.status(400).json({ ok: false, errors:[{ msg: 'El Correo ya existe -- controller POST' }]});
        }   
    
        usuario = new Usuario({ nombre, correo, password, rol });
    
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync( password, salt );
        
        await usuario.save();
        const token = await generarJWT( usuario.id, usuario.name );   // Generar JWT
        res.json({ usuario, token });

    } catch (error) {
        console.log('error en crear usuario:', error)
        res.status(500).json({ ok: false, errors:[{msg: 'Por favor hable con el administrador --- controller'}]});
    }
   
}





const usuariosPut = async(req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, /* correo, */ ...resto } = req.body;

    if ( password ) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json(usuario);
}



const usuariosPatch = (req, res = response) => {
    res.json({ errors:[{msg: 'patch API - usuariosPatch --- controller'}] });
}




const usuariosDelete = async(req, res = response) => {

    const { id } = req.params;
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false } );
    // res.json(usuario); 

}




const usuariosToggle = async(req, res = response) => {

    const { id } = req.params;
    const usuarioInfo = await Usuario.findById(id) 

    let newValue = !usuarioInfo.toggle
    const usuario = await Usuario.findByIdAndUpdate(id, { toggle:newValue }, {new: true});

    res.json(usuario);

}



module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
    usuariosToggle
}