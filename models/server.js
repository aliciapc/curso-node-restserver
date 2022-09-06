const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileUpload');

const { dbConnection } = require('../database/config');

class Server {
    
    //Generalmente las propiedades se declaran en el constructor
    constructor(){
        //Creamos en el archivo del servidor la aplicacion de express como una propiedad en la misma clase de servidor.
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            categorias: '/api/categorias',
            productos: '/api/productos',
            uploads: '/api/uploads',
            usuarios: '/api/users',
        }
        // this.usersRoutePath = '/api/users';
        // this.authPath = '/api/auth';
        //this.categorias = '/api/categorias';

        //Conectar a base de datos
        this.conectarDB();


        //Para servir la carpeta pública-->MIDDLEWARES-->Funciones que van a añadir otra funcionalidad a mi WebServer
        //Implementamos la carpeta pública
        this.middlewares();                   

        //Rutas de mi aplicación
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        //CORS
        this.app.use(cors());

        //Lectura y parseo del body
        this.app.use(express.json());

        //Directorio publico
        this.app.use(express.static('public'));

        //FileUpload-carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true // si no existe la carpeta para nuestro archivo, la crea
        }));
    }

    routes(){
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
        this.app.use(this.paths.usuarios, require('../routes/user.routes'));
    }


    listen(){
        this.app.listen(this.port, ()=>{
            console.log(`Running Server in port`, this.port)
        });
    }
}

module.exports = Server;