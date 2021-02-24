import proyectos from './modulos/proyectos'; // gracias a babel usamos el import en vez del reuire
import tareas from './modulos/tareas';
import {actualizarAvance} from './funciones/avance';


document.addEventListener('DOMContentLoaded', () => {
    actualizarAvance();
})