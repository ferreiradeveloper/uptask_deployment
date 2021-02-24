const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('./Proyectos'); // lo importamos para crear la relacion

// definimos el modelo
const Tareas = db.define('tareas', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    tarea: Sequelize.STRING(100),
    estado: Sequelize.INTEGER(1)
});

// creando las relaciones
Tareas.belongsTo(Proyectos);
//Proyectos.hasMany(Tareas); --> otra forma de crear la relacion pero se coloca en el modelo padre

module.exports = Tareas;