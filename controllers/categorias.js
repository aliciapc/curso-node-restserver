const {response, request} = require('express');
const {Categoria}= require('../models');

//obtenerCategoria -paginado -total 
//populate(método de mongoose)
const obtenerListadoCategoria = async (req, res= response) =>{
    const {limite = 5, desde = 0} = req.query;
    const query = {estado:true};

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        .populate('usuario', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        total,
        categorias
    });
}

//obtenerCategoriaId
//populate(método de mongoose)
const obtenerCategoriaId = async (req, res=response) =>{
    const {id}= req.params;
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

    res.json(categoria);
    
}


//Crear categoria
const crearCategoria = async (req, res = response) =>{

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});
    if(categoriaDB){
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre} ya existe`
        })
    }

    //Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    //Crea y guarda pero no lo graba en BBDD
    const categoria = new Categoria(data);

    //Grabar en BBDD
    await categoria.save();

    res.status(201).json(categoria);
}


//actualizarCategoria -validaciones respectivas, solo hay que recibir el nombre
const actualizarCategoria = async (req, res = response) =>{
    const {id} = req.params;
    const {estado, usuario,...data} = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;
/* 
    if(!nombre){
        return res.json({
            msg: `El nombre ${nombre} introducido no es válido`
        })
    } */

    //{new:true} para que se vea el objeto actualizado
    const categoria = await Categoria.findByIdAndUpdate(id, data, {new:true});

    res.json(categoria);

}


//borrarCategoria -estado:false
const borrarCategoria = async (req, res = response) =>{
    const {id} = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id, {estado:false},{new: true});

    res.json(categoria);
}


module.exports = {
    crearCategoria,
    obtenerListadoCategoria,
    obtenerCategoriaId,
    actualizarCategoria,
    borrarCategoria
}