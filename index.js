const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

// importar las variables
require('dotenv').config({ path: 'variables.env'});  

// helpers con algunas funciones
const helpers = require('./helpers');


// Crear conexion a la BD
const db = require('./config/db');

// importar modelos
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');


db.sync()
    .then(()=> console.log('Conectado al Server'))
    .catch((error)=> console.log(error))

// crear una app de express
const app = express();

// descargar los archivos estaticos
app.use(express.static('public'));

// habilitar PUG
app.set('view engine','pug');

// habilitar bodyparser para leer datos del formulario
app.use(bodyParser.urlencoded({extended: true}));


// Añadir la carpeta de las vistas
app.set('views', path.join(__dirname,'./views'));

// habilitar cookieParser
app.use(cookieParser());

// agregar flash message
app.use(flash());

// habilitamos session (permite la navegacion entre paginas sin volver a autenticarnos)
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


// Pasar vardump a la aplicacion
app.use((req, res, next) => {   
    //console.log(req.user); 
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;   
    next();
});



//aprediendo midleware (nuestro propio midleware)
app.use((req, res, next) => {
    const fecha = new Date();
    res.locals.year = fecha.getFullYear();
    next();
});

app.use('/',routes());


// Servidor y Puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
    console.log('El Servidor esta LISTO');
})
