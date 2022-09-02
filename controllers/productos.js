const {response} = require('express');
const {Producto}= require('../models');

//obtenerProducto -paginado -total 
//populate(método de mongoose)
const obtenerListadoProducto = async (req, res= response) =>{
    const {limite = 5, desde = 0} = req.query;
    const query = {estado:true};

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        total,
        productos
    });
}

//obtenerProductoId
//populate(método de mongoose)
const obtenerProductoId = async (req, res=response) =>{
    
    const {id}= req.params;
    const producto = await Producto.findById(id)
                            .populate('usuario', 'nombre')
                            .populate('categoria', 'nombre');

    res.json(producto);
    
}


//Crear Producto
const crearProducto = async (req, res = response) =>{

    const {estado, usuario, ...body} = req.body;

    const productoDB = await Producto.findOne({nombre: body.nombre});
    if(productoDB){
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre} ya existe`
        })
    }

    //Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    //Crea y guarda pero no lo graba en BBDD
    const producto = new Producto(data);

    //Grabar en BBDD
    await producto.save();

    res.status(201).json(producto);
}


//actualizarProducto -validaciones respectivas, solo hay que recibir el nombre
const actualizarProducto = async (req, res = response) =>{
    const {id} = req.params;
    const {estado, usuario,...data} = req.body;

    if(data.nombre){
        data.nombre = data.nombre.toUpperCase();
    } 
    data.usuario = req.usuario._id;

    //{new:true} para que se vea el objeto actualizado
    const producto = await Producto.findByIdAndUpdate(id, data, {new:true});

    res.json(producto);

}


//borrarProducto -estado:false
const borrarProducto = async (req, res = response) =>{
    const {id} = req.params;

    const producto = await Producto.findByIdAndUpdate(id, {estado:false},{new: true});

    res.json(producto);
}


module.exports = {
    crearProducto,
    obtenerListadoProducto,
    obtenerProductoId,
    actualizarProducto,
    borrarProducto
}