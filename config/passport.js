const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Referencia al modelo donde vamos a autenticar
const Usuarios = require('../models/Usuarios');

// local strategy (login con credenciales propias (user/pass))
passport.use(
    new LocalStrategy(
        // por default passport espera un user y un pass
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: { 
                        email: email,
                        activo: 1
                    }
                });
                // user exists, pass fail
                if(!usuario.verificarPassword(password)) {
                    return done(null, false, {
                        message : 'Password Incorrecto'
                    })
                }
                // user exist & pass correct
                return done(null, usuario);
            } catch (error) {
                // usuario no existe
                return done(null, false, {
                    message : 'Esa cuenta no existe'
                })
            }
        }
    )
);

// serializar el usuario
passport.serializeUser((usuario, callback ) => {
    callback(null, usuario);
});


// deserializar el usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});


// exportar
module.exports = passport;