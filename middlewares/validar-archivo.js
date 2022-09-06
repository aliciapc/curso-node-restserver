//Si en la require viene la propiedad file, sino error 400
  //Object keys hace un barrido de la propiedad, lo recorre, si es 0 el largo del array, envia error
  //O nombre del archivo

const validarArchivoSubir = (req, res = response, next) =>{
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    return res.status(400).json({ 
        msg: "No hay archivos que subir - validarArchivoSubir" });
  }
  next();
}

module.exports = {
    validarArchivoSubir
}