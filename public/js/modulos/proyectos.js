import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

if (btnEliminar){
  btnEliminar.addEventListener('click', (e)=> {
    const urlProyecto = e.target.dataset.proyectoUrl;

    // console.log(urlProyecto);      
    Swal.fire({
        title: 'Esta Seguro de Borrar el registro?',
        text: "Una vez borrado no se puede recuperar!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Borrar!',
        cancelButtonText: 'No, Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          // enviar peticion a axios
          const url = `${location.origin}/proyectos/${urlProyecto}`;
          
          axios.delete(url, { params: {urlProyecto} })
            .then(function(respuesta) {
              console.log(respuesta);              

              Swal.fire(
                'Eliminado!',
                respuesta.data,
                'success'
              );

              // redireccionar al inicio
              setTimeout(() =>{
                window.location.href = '/';
              }, 1500)

            })
            .catch(() => {
              Swal.fire({
                icon:'error',
                title: 'Hubo un Error',
                text: 'No se pudo Eliminar el Proyecto'
              })
            })          

        }
      })
  });
}

export default btnEliminar;
