const {response} = require('express');
const {ObjectId}= require('mongoose').Types;

const{Usuario, Categoria, Producto}=require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async(termino='', res= response)=>{

    const esMongoID= ObjectId.isValid(termino);//TRUE

    //Termino = id
    if(esMongoID){
        const usuario = await Usuario.findById(termino);
        return res.json({
            //Si el usuario existe, devolvemos un array con el usuario, sino uno vacio
            //Es necesario en este caso por el findById, si es find solo, lo hace implicitamente
            results: (usuario)?[usuario]:[]
        });
    }

    const regex = new RegExp(termino, 'i');

    //termino = nombre
    const usuarios = await Usuario.find({ //tambien podemos usar .count
        //propiedades de mongo
        $or: [{nombre: termino}, {correo: regex}],
        $and: [{estado:true}]
    });

    res.json({
        results: usuarios
    });
}

const buscarCategorias = async(termino='', res= response)=>{

    const esMongoID= ObjectId.isValid(termino);//TRUE

    //Termino = id
    if(esMongoID){
        const categoria = await Categoria.findById(termino);
        return res.json({
            //Si el usuario existe, devolvemos un array con el usuario, sino uno vacio
            //Es necesario en este caso por el findById, si es find solo, lo hace implicitamente
            results: (categoria)?[categoria]:[]
        });
    }

    const regex = new RegExp(termino, 'i');

    //termino = nombre
    const categorias = await Categoria.find({nombre: termino, estado:true});

    res.json({
        results: categorias
    });
}


const buscarProductos = async(termino='', res= response)=>{

    const esMongoID= ObjectId.isValid(termino);//TRUE

    //Termino = id
    if(esMongoID){
        const producto = await Producto.findById(termino)
                                .populate('categoria', 'nombre');
        return res.json({
            //Si el usuario existe, devolvemos un array con el usuario, sino uno vacio
            //Es necesario en este caso por el findById, si es find solo, lo hace implicitamente
            results: (producto)?[producto]:[]
        });
    }

    const regex = new RegExp(termino, 'i');

    //termino = nombre
    const productos = await Producto.find({ nombre: termino, estado:true})
                            .populate('categoria', 'nombre')

    res.json({
        results: productos
    });
}
const buscar = (req, res = response)=>{
    const {coleccion, termino}= req.params;

    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino,res);
        break;
        case 'categorias':
            buscarCategorias(termino,res);
        break;
        case 'productos':
            buscarProductos(termino, res)
        break;
    
        default:
            res.status(500).json({
                msg:'Se me olvidó hacer esta búsqueda'
            })
           
    }

   
}

module.exports={
    buscar
}