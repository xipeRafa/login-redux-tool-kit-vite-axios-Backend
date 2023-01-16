const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio  -- models'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: { // id del usuario
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    toggle: {
        type: Boolean
    }
});


CategoriaSchema.methods.toJSON = function() {
    const { __v, estado, _id, ...data  } = this.toObject();
    data.cid = _id;
    return data;
}


module.exports = model( 'Categoria', CategoriaSchema );
