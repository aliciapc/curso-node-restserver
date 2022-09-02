
const {Schema, model}= require('mongoose');

const CategoriaSchema = Schema ({
    nombre: {
        type: String,
        required: [true, 'El nombre el obligatorio'],
        unique: true
    },
    estado:{
        type:Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true 
    }
});

//extraer el password, __v, _id. Aquellas propiedades que no nos interesan
CategoriaSchema.methods.toJSON = function(){
    const {__v,estado,...data}= this.toObject();
    return data;
}

module.exports = model('Categoria', CategoriaSchema);