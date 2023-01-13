const Role = require('../models/role');
const { Usuario, Categoria, Producto } = require('../models');





const esRoleValido = async(rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la BD --- db-validators`);
    }
}




const emailExiste = async( correo = '' ) => {
    const existeEmail = await Usuario.findOne({ correo });
    if ( existeEmail ) {
        console.log('repetido:', existeEmail);
        throw new Error(`El correo: ${ correo }, ya está registrado --- db-validators`);
    }
}




const existeUsuarioPorId = async( id ) => {
    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario ) {
        throw new Error(`El id no existe ${ id } --- db-validators`);
    }
}



const existeCategoriaPorId = async( id ) => {
    const existeCategoria = await Categoria.findById(id);
    if ( !existeCategoria ) {
        throw new Error(`El id no existe ${ id } --- db-validators`);
    }
}




const nombreRepetido = async(nombre='') => {
    const repetido = await Producto.findOne({ nombre });
    if ( repetido ) {
        console.log('repetido:', repetido.nombre);
        throw new Error({ msg: `El producto ${ repetido.nombre }, ya existe --- db-validators` });
    }
}





const nombreRepetidoUsuario = async(nombre='') => {
    const repetido = await Usuario.findOne({ nombre });
    if ( !repetido ) {
        console.log('repetido:', repetido.nombre);
        throw new Error({ msg: `El producto ${ repetido.nombre }, ya existe --- db-validators` }); 
    }
}






const existeProductoPorId = async( id ) => {
    const existeProducto = await Producto.findById(id);
    if ( !existeProducto ) {
        throw new Error(`El id no existe ${ id } --- db-validators`); 
    }
}






const coleccionesPermitidas = ( coleccion = '', colecciones = []) => {
    const incluida = colecciones.includes( coleccion );
    if ( !incluida ) {
        throw new Error(`La colección ${ coleccion } no es permitida, ${ colecciones } --- db-validators`);
    }
    return true;
}



module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas,
    nombreRepetido,
    nombreRepetidoUsuario
}

