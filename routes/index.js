const express = require('express');
const router = express.Router();

// importar express-validator
const { body } = require('express-validator/check');

// importar los controladores
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');


module.exports = function() {

    // ruta pata home
    router.get('/', authController.usuarioAutenticado , proyectosController.proyectoHome);
    router.get('/nuevo-proyecto', authController.usuarioAutenticado ,proyectosController.formularioProyecto);
    router.post('/nuevo-proyecto',
        authController.usuarioAutenticado , 
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoProyecto); 
        
    // listar Proyecto
    router.get('/proyectos/:url', authController.usuarioAutenticado ,proyectosController.proyectoPorUrl);
    
    // Actualizar las tareas
    router.get('/proyecto/editar/:id', authController.usuarioAutenticado ,proyectosController.formularioEditar);
    
    router.post('/nuevo-proyecto/:id', 
    authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.actualizarProyecto); 

    // eliminar proyecto
    router.delete('/proyectos/:url', authController.usuarioAutenticado ,proyectosController.eliminarProyecto);

    // route para las Tareas
    router.post('/proyectos/:url', authController.usuarioAutenticado ,tareasController.agregarTarea);

    // Actualizar Tarea
    router.patch('/tareas/:id', authController.usuarioAutenticado ,tareasController.cambiarEstadoTarea);

    // Eliminar Tarea
    router.delete('/tareas/:id', authController.usuarioAutenticado ,tareasController.eliminarTarea);

    // Crear nueva Cuenta
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', usuariosController.crearCrearCuenta);
    router.get('/confirmar/:correo', usuariosController.confirmarCuenta);

    // Iniciar sesión
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);

    // cerrar sesion
    router.get('/cerrar-sesion', authController.cerrarSesion);

    // reestablecer contraseña
    router.get('/reestablecer', usuariosController.formReestablecerPassword);
    router.post('/reestablecer', authController.enviarToken);
    router.get('/reestablecer/:token', authController.validarToken); 
    router.post('/reestablecer/:token', authController.actualizarPassword);


    return router;
   
}

