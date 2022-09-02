const { Categoria } = require("../models");
const Role = require("../models/role");
const Usuario = require("../models/usuario");

const esRolValido = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol ${rol} no está registrado en la bbdd`);
  }
};

//Verificar si el correo existe
const emailExiste = async (correo = "") => {
  const existeEmail = await Usuario.findOne({ correo });
  if (existeEmail) {
   throw new Error(`El correo ${correo} ya está registrado`); 
  }
};

//Verificar si el id ya existe
const existeUsuarioId = async (id ) => {
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
         throw new Error(`El usuario con id ${id} no existe`); 
    }
  };

  //Verificar si existe la categoría
  const existeCategoria = async (id ) => {
    
    const existeCategoriaId = await Categoria.findById(id);
    if (!existeCategoriaId) {
         throw new Error(`La categoria con id ${id} no existe`); 
    }
  };

  //Verificar si existe la categoría
  const existeProducto = async (id ) => {
    
    const existeProductoId = await Producto.findById(id);
    if (!existeProductoId) {
         throw new Error(`El producto con id ${id} no existe`); 
    }
  };

module.exports = {
  esRolValido,
  emailExiste,
  existeUsuarioId,
  existeCategoria,
  existeProducto
};
