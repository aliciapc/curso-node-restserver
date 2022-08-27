const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {
    
    //Generalmente las propiedades se declaran en el constructor
    constructor(){
        //Creamos en el archivo del servidor la aplicacion de express como una propiedad en la misma clase de servidor.
        this.app = express();
        this.port = process.env.PORT;
        this.usersRoutePath = '/api/users';

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
    }

    routes(){
        this.app.use(this.usersRoutePath, require('../routes/user.routes'));
    }


    listen(){
        this.app.listen(this.port, ()=>{
            console.log(`Running Server in port`, this.port)
        });
    }
}

module.exports = Server;