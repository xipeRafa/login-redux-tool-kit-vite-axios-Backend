const { response } = require('express');
const { Categoria } = require('../models');


const obtenerCategorias = async(req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'nombre')
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({ total, categorias })

}




const obtenerCategoria = async(req, res = response ) => {

    const { id } = req.params;
    const categoria = await Categoria.findById( id ).populate('usuario', 'nombre');

    res.json( categoria );

}




const crearCategoria = async(req, res = response ) => {

    const nombre = req.body.nombre;
    const categoriaDB = await Categoria.findOne({ nombre });

    if ( categoriaDB ) {
        return res.status(400).json({
            errors:[{errors:[{msg: `La categoria ${ categoriaDB.nombre }, ya existe -- controller`}]}]
        });
    }

    const data = { nombre, usuario: req.usuario._id }

    const categoria = new Categoria( data );

    await categoria.save();


    res.status(201).json(categoria);

}




const actualizarCategoria = async( req, res = response ) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre  = data.nombre;
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

    res.json( categoria );

}




const borrarCategoria = async(req, res =response ) => {

    const { id } = req.params;
    const categoriaBorrada = await Categoria.findByIdAndUpdate( id, { estado: false }, {new: true });

    res.json( categoriaBorrada );
}




const categoriasToggle = async(req, res = response) => {

    const { id } = req.params;
    const usuarioInfo = await Categoria.findById(id) 

    let newValue = !usuarioInfo.toggle
    const usuario = await Categoria.findByIdAndUpdate(id, { toggle:newValue }, {new: true});

    res.json(usuario);

}




module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria,
    categoriasToggle
}