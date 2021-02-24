const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear Cuenta en UpTask'
    });
}

exports.formIniciarSesion = (req, res) => {
    const {error} = res.locals.mensajes;
    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar Sesión en UpTask',
        error : error
    });
}

exports.crearCrearCuenta = async (req, res) => {
    // leer los datos
    //console.log(req.body);
    const { email, password } = req.body;


    try {
        // creamos el usuario
        await Usuarios.create({
                email,
                password
            });

            // crear una url de confirmar
            const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;
            
            // crear el objeto de usuario
            const usuario = {
                email
            }
            
            // enviar email
            await enviarEmail.enviar({
                usuario,
                subject: 'Confirma tu cuenta UpTask',
                confirmarUrl,
                archivo: 'confirmar-cuenta'
            });

            // redirigir al usuario
            req.flash('correcto', 'Enviamos un correo, confirma tu cuenta');
            res.redirect('/iniciar-sesion');            

    } catch (error) {
        req.flash('error', error.errors.map(error => error.message));            
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear Cuenta en UpTask',
            email,
            password
        });
    }
}

exports.formReestablecerPassword = (req, res) => {
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer tu Contraseña'
    })
}

exports.confirmarCuenta = async (req, res) => {
    //res.json(req.params.correo);
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    });

    // if not exists user
    if(!usuario) {
        req.flash('error', 'No valido');
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto','Cuenta activada Correctamente');
    res.redirect('/iniciar-sesion');
}