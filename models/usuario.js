
const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio  -- models']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio -- models'],
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria -- models'],
    },
    img: {
        type: String,
    },
    rol: {
        type: String,
        default: 'USER_ROLE',
        emun: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    },
    toggle: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
});



UsuarioSchema.methods.toJSON = function() {
    const { __v, password, _id, ...usuario  } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

module.exports = model( 'Usuario', UsuarioSchema );
