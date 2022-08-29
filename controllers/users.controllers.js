const{response, request}= require('express');
const bcryptjs = require('bcryptjs');


//Nos permite crear instancias de mi modelo por eso la U mayúscula
const Usuario = require('../models/usuario');


const usersGet = async (req = request, res = response)=>{
    //const {q, nombre} = req.query;
    const  {limite = 5, desde = 0} = req.query;
    const query = {estado: true};

   /*  const usuarios = await Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite));
    
    const total = await Usuario.countDocuments(query); */

    //Disparar las dos peticiones await de manera simultanea, para evitar las esperas
    //manda un arreglo con todas las promesas que se tienen que ejecutar
    //si no ponemos el await ejecuta las promesas a destiempo, si lo ponemos espera a la resolución de ambas
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);


    res.json({
        total,
        usuarios
    });
}

const usersPost =async (req, res = response)=>{
    
    const {nombre, correo, password, rol} = req.body;
    //Creación de la instancia
    const usuario = new Usuario({nombre, correo, password, rol});


    //Encriptar la constraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);
    //Guardar en bbdd


    //Grabar el registro en mongoose
    await usuario.save();

    res.json({
        msg: "post API - controller ",
        usuario
    });
}

const usersPut = async (req, res = response)=>{
    const {id} = req.params;
    const {_id, password, google,correo, ...resto}= req.body;

    //TODO validar contra base de datos
    if (password){
        //también podriamos crear una función helper para no repetir código
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }
    // Buscalo por id, y actualiza
    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuario);
}

const usersPatch =(req, res = response)=>{
    res.json({
        msg: "pacth API - controller "
    });
}

const usersDelete = async (req, res = response)=>{
    const {id} = req.params;

    const uid =req.uid;

    //Eliminar registro fisicamente
    //const usuario = await Usuario.findByIdAndDelete(id);
    //Mejor cambiar el estado de usuario en vez de eliminar
    const usuario = await Usuario.findByIdAndUpdate(id, {estado:false});
    const usuarioAutenticado = req.usuario;

    res.json({
        msg: "delete API - controller ",
        usuario, 
        //uid
        //usuarioAutenticado
    });
}


module.exports = {
    usersGet,
    usersPost,
    usersPut,
    usersPatch,
    usersDelete
}