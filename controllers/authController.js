const passport = require('passport'); // en este caso solo un metodo de passport
const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const crypto = require('crypto'); //genera un token ya viene con node
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion', 
    failureFlash: true,
    badRequestMessage: 'Ambos Campos son Requeridos'
});

// funcion para verificar si el user esta logeado
exports.usuarioAutenticado = (req, res, next) => {
    // si autenticado ok go...
    if(req.isAuthenticated()){
        return next();
    }
    // user no autenticado redirect to form
    return res.redirect('/iniciar-sesion');
}

// funcion para cerrar sesion
exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion'); // al cerrar sesion nos lleva al login
    })
}

// genera un token si el usuario es valido
exports.enviarToken = async (req, res) => {
    // verificar que exista --> importar el modelo usuario
    const {email} = req.body;
    const usuario = await Usuarios.findOne({where: { email }});

    // si no existe el usuario
    if(!usuario) {
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/reestablecer');        
    } 

    // usuario existe
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 36000000;
    
    // guardarlos en la base de datos
    await usuario.save();

    // url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;
    
    // envia el correo con el token
    const enviarEmail = require('../handlers/email');
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'reestablecer-password'
    })
    console.log(resetUrl);

    // terminar la ejecucion 
    req.flash('correcto', 'Se envió un mensaje a tu correo');
    res.redirect('/iniciar-sesion');    
}

exports.validarToken = async (req, res) => {
    
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });
        
    // si no encuentra al usuario
    if(!usuario) {
        req.flash('error', 'No Válido');
        res.redirect('/reestablecer');
    }

    // formulario para regenerar password
        res.render('resetPassword', {
            nombrePagina : 'Reestablecer Contraseña'
        })


}


// cambia el pass por uno nuevo
exports.actualizarPassword = async (req, res) => {

    // verifica el token valido pero también la fecha de expiracion
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    });

    // verificamos si existe 
    if(!usuario) {
        req.flas('error', 'No Válido');
        res.redirect('/reestablecer');
    }

    //  hashear el nuevo pass
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;

    // guardamos el nuevo pass
    await usuario.save();

    req.flash('correcto', 'Tu password se ha Reestablecido');
    res.redirect('/iniciar-sesion');    
}


