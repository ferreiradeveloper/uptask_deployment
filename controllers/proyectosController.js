const Proyectos = require('../models/Proyectos');
//const slug = require('slug');
const Tareas = require('../models/Tareas');

exports.proyectoHome = async (req,res) => {

    //console.log(res.locals.usuario);
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId} });


    res.render('index', {
        nombrePagina: 'Proyectos',
        proyectos
    });
}

exports.formularioProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId} });

    res.render('nuevoproyecto', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    })
}

exports.nuevoProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId} });
    
    //console.log(req.body);
    
    // validar que tengamos algo en el input
    const { nombre } = req.body;

    let errores = [];

    if (!nombre) {
        errores.push({'texto': 'agrega un nombre al proyecto'});
    }

    // si hay errores
    if(errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos 
        })
    } else {
        // no hay errores
        // insert en la base de datos

        //const url = slug(nombre).toLowerCase();
        const usuarioId = res.locals.usuario.id;
        await Proyectos.create({ nombre, usuarioId });
        res.redirect('/');

            //.then(() => console.log('Insertado Correctamente'))
            //.catch((error) => console.log(error));
    }
}

exports.proyectoPorUrl = async (req, res, next) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where: { usuarioId } });

    const proyectoPromise = Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId
        }
    });
    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    // Consultar Tareas del proyecto actual
    const tareas = await Tareas.findAll({
        where: {
            proyectoId : proyecto.id
        },
        // include: [
        //     { model:Proyectos }
        // ]
    });
    
    if (!proyecto) return next();
    // reder a la vista
    res.render ('tareas', {
        nombrePagina: 'Tareas del Proyecto',
        proyecto,
        proyectos,
        tareas
    })
}

exports.formularioEditar = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where: usuarioId });

    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await  Promise.all([proyectosPromise,proyectoPromise]);


    // render la vista
    res.render('nuevoProyecto', {
        nombrePagina: 'Editar Proyecto',
        proyectos,
        proyecto
    })
}

exports.actualizarProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: usuarioId });
    // validar que tengamos algo en el input
    const { nombre } = req.body;

    let errores = [];

    if (!nombre) {
        errores.push({'texto': 'agrega un nombre al proyecto'});
    }

    // si hay errores
    if(errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos 
        })
    } else {
        
        await Proyectos.update(
            { nombre: nombre },
            {where: {id: req.params.id}}
            );
        res.redirect('/');
    }
}

exports.eliminarProyecto = async (req, res ,next) => {
    // req, query o params
    //console.log(req.params);
    const {urlProyecto} = req.query;

    const resultado = await Proyectos.destroy({where: { url : urlProyecto } });

    if (!resultado){
        return next();
    }

    res.status(200).send('Proyecto Eliminado Correctamente');

}
