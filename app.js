require('dotenv').config();
const Server = require('./models/server');

//Instanciamos el servidor
const server = new Server();
//lanzamos el servidor
server.listen();
