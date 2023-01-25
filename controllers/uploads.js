const path = require('path');
const fs   = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );

const { response } = require('express');
const { subirArchivo } = require('../helpers');
const { Usuario, Producto } = require('../models');




const cargarArchivo = async(req, res = response) => {
    try {
        const nombre = await subirArchivo( req.files, undefined, 'imgs' );  // txt, md
        res.json({ nombre });  // const nombre = await subirArchivo( req.files, ['txt','md'], 'textos' ); --undefined
    } catch (msg) {
        res.status(400).json({ msg });
    }
}




const actualizarImagen = async(req, res = response ) => {

    const { id, coleccion } = req.params;
    let modelo;

    switch ( coleccion ) {

        case 'usuarios': modelo = await Usuario.findById(id);
            if ( !modelo ) {
                return res.status(400).json({errors:[{msg: `No existe un usuario con el id ${ id } --- controller` }]});
            }
        break;

        case 'productos': modelo = await Producto.findById(id);
            if ( !modelo ) {
                return res.status(400).json({ errors:[{msg: `No existe un producto con el id ${ id } --- controller` }]});
            }
        break;
    
        default: return res.status(500).json({ errors:[{msg: 'Se me olvidó validar esto 2 --- controller'}]});
    }

    if ( coleccion === 'usuarios' ) { // Limpiar imágenes previas
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
        if ( fs.existsSync( pathImagen ) ) {
            fs.unlinkSync( pathImagen ); // Hay que borrar la imagen del servidor
        }
    }

    const nombre = await subirArchivo( req.files, undefined, coleccion );
    modelo.img = nombre;
    await modelo.save();
    res.json( modelo );
}




const actualizarImagenCloudinary = async(req, res = response ) => {

    const { id, coleccion } = req.params;
    let modelo;

    switch ( coleccion ) {

        case 'usuarios': modelo = await Usuario.findById(id);
            if ( !modelo ) {
                return res.status(400).json({ errors:[{msg: `No existe un usuario con el id ${ id } --- controller`}] });
            }
        break;

        case 'productos': modelo = await Producto.findById(id);
            if ( !modelo ) {
                return res.status(400).json({ errors:[{msg: `No existe un producto con el id ${ id } --- controller`}] });
            }
        break;
    
        default: return res.status(500).json({ errors:[{msg: 'Se me olvidó validar esto --- controller'}]});
    }

    if ( modelo.img ) { // Limpiar imágenes previas
        const nombreArr = modelo.img.split('/');
        const nombre    = nombreArr[ nombreArr.length - 1 ];
        const [ public_id ] = nombre.split('.');
        cloudinary.uploader.destroy( public_id ); //  borrar imagenes cloudinary
    }

    const { tempFilePath } = req.files.file
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
    
    modelo.img = secure_url;
    await modelo.save();
    res.json( modelo );
}





const mostrarImagen = async(req, res = response ) => {

    const { id, coleccion } = req.params;
    let modelo;

    switch ( coleccion ) {

        case 'usuarios': modelo = await Usuario.findById(id);
            if ( !modelo ) {
                return res.status(400).json({errors:[{ msg: `No existe un usuario con el id ${ id } --- controller`}] });
            }
        break;

        case 'productos': modelo = await Producto.findById(id);
            if ( !modelo ) {
                return res.status(400).json({errors:[{ msg: `No existe un producto con el id ${ id } --- controller`}] });
            }
        break;
    
        default: return res.status(500).json({errors:[{ msg: 'Se me olvidó validar esto --- controller'}]});
    }

    if ( modelo === 'usuarios' ) {    // Limpiar imágenes previas
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
        if ( fs.existsSync( pathImagen ) ) {         // Hay que borrar la imagen del servidor
            return res.sendFile( pathImagen )
        }
    }

    const pathImagen = path.join( __dirname, '../assets/no-image.jpg');
/*     res.status(400).json({ errors:[{msg: 'no hay imagen' }] });
 */    res.sendFile( pathImagen );
}




module.exports = { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary }