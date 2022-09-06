const path = require('path');
const { v4: uuidv4 } = require('uuid');

//Extraemos la request desde aquí (files), también podriamos desestructurar el {archivo} 
const subirArchivo = (files, extensionesValidas=["png", "jpg", "jpeg", "git"], carpeta = '') => {
  //Necesitamos saber si el código que viene a continuación sale bien o mal, para ello creamos una promesa
  return new Promise((resolve, reject) => {
    //Desestructuramos y sacamos la propiedad archivo de la req.files
    const { archivo } = files;//req.files;
    //Sacamos la extensión del archivo
    const nombreCortado = archivo.name.split(".");
    const extension = nombreCortado[nombreCortado.length - 1];

    //Validar la extensión
    if (!extensionesValidas.includes(extension)) {
        return reject(`La extensión ${extension} no esta permitida, ${extensionesValidas}`)
    }

    //Nombre temporal lo va a generar por uuid
    const nombreTemp = uuidv4() + "." + extension;
    //Construcción del path
    //unimos cada uno de los trocitos de path //__direname-->donde nos encontramos
    const uploadPath = path.join(__dirname, "../uploads/", carpeta , nombreTemp);

    //mv. lo va a mover al path
    archivo.mv(uploadPath, (err) => {
      if (err) {
        //los internal server error se deberian de mostrar por consola
        reject(err);
      }

      //Al no tener la respuesta mandamos un resolve
      resolve(nombreTemp);
      //res.json({ msg: "File uploaded to " + uploadPath });
    });
  });
};

module.exports = {
  subirArchivo,
};
