const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio -- model'], 
        unique: [true, 'El nombre no se puede repetir -- model'], 
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true 
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {  // id de la categoria
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true 
    },
    descripcion: { type: String },
    disponible: { type: Boolean, defult: true },
    img: { type: String },
});


ProductoSchema.methods.toJSON = function() {
    const { __v, estado, _id, ...data  } = this.toObject();
    data.pid = _id;
    return data;
}



module.exports = model( 'Producto', ProductoSchema );
