const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');

// console.log( process.env );


//* Crear el servidor de express

const app = express();

//* Conectando a la Base de datos
dbConnection();

//* CORS
app.use( cors())

//* Directorio publico
app.use( express.static('public')); //! use en express es conocido como un middleware : no es mas que una funcion que se ejecuta en el momento en que alguien hace una peticion a mi servidor

//* Lectura y parseo del body
app.use( express.json() ); // las peticiones que vengan en formato json las voy a procesar ahí y voy a extraer su contenido

//* Rutas

app.use('/api/auth', require('./routes/auth')); // Todo lo que el archivo auth va a exportar lo va hablilitar en esta ruta 
app.use('/api/events', require('./routes/events'));

//* Comodin para cuando las rutas de arriba, va a servir mi archivo index
app.get('*', (req, res) => {
    res.sendFile( __dirname + '/public/index.html');
})

//* Escuchar peticiones

app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${ process.env.PORT }`);
} )