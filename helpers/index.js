

const dbValidators = require ('./db-validators');
const generarJWT = require ('./generar-jwt');
const subirArchivo = require ('./subir-archivo');

module.exports={
    //Espandimos contenido '...', de esta manera tenemos todas las propiedades 
    ...dbValidators,
    ...generarJWT,
    ...subirArchivo
}