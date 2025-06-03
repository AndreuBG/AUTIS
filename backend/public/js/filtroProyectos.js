document.addEventListener('DOMContentLoaded', () => {
    const filtroActividad = document.getElementById('filtro-actividad-proyectos');
    const proyectosContainer = document.getElementById('proyectos');
    const botonAplicarFiltro = document.querySelector('#filtro-proyectos .aplicar-filtro');


    // Función para aplicar el filtro
    botonAplicarFiltro.addEventListener('click', () => {
        const actividadSeleccionada = filtroActividad.value;

        // Si la actividad es inactiva, ocultamos todos los proyectos
        if (actividadSeleccionada === 'inactivo') {
            proyectosContainer.style.display = 'none';

            // Crear un mensaje informativo
            let mensajeExistente = document.getElementById('mensaje-inactivo');

            if (!mensajeExistente) {
                const mensajeInactivo = document.createElement('div');
                mensajeInactivo.id = 'mensaje-inactivo';
                mensajeInactivo.style.textAlign = 'center';
                mensajeInactivo.style.padding = '20px';
                mensajeInactivo.style.color = '#09348bf8';
                mensajeInactivo.style.fontSize = '1.2em';
                mensajeInactivo.style.backgroundColor = '#ffffffe1';
                mensajeInactivo.style.margin = '20px auto';
                mensajeInactivo.style.borderRadius = '6px';
                mensajeInactivo.style.maxWidth = '800px';
                mensajeInactivo.textContent = 'No hay proyectos inactivos para mostrar';

                // Insertar el mensaje después del contenedor de proyectos
                proyectosContainer.parentNode.insertBefore(mensajeInactivo, proyectosContainer.nextSibling);
            }
        } else {
            // Si no es inactivo, mostrar los proyectos
            proyectosContainer.style.display = 'grid';

            // Eliminar el mensaje si existe
            const mensajeExistente = document.getElementById('mensaje-inactivo');
            if (mensajeExistente) {
                mensajeExistente.remove();
            }
        }
    });

    // Filtros de tareas
    const filtroTipo = document.getElementById('filtro-tipo-tareas');
    const filtroEstadoTareas = document.getElementById('filtro-estado-tareas');
    const filtroTipoEstado = document.getElementById('filtro-tipo-estado-tareas');
    
    // Ocultar T.Estado inicialmente
    filtroTipoEstado.parentElement.style.display = 'none';
    
    // Solo reaccionamos al cambio de Estado
    filtroEstadoTareas.addEventListener('change', () => {
        console.log('Estado seleccionado:', filtroEstadoTareas.value); // Mantener para debug
        if (filtroEstadoTareas.value === 'abierto') {
            filtroTipoEstado.parentElement.style.display = 'block';
        } else {
            filtroTipoEstado.parentElement.style.display = 'none';
            filtroTipoEstado.value = '';
        }
    });
});
