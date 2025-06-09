document.addEventListener('DOMContentLoaded', () => {
    const filtroActividad = document.getElementById('filtro-actividad-proyectos');
    const proyectosContainer = document.getElementById('proyectos');
    const botonAplicarFiltro = document.querySelector('#filtro-proyectos .aplicar-filtro');

    // Filtros de tareas
    const filtroTipo = document.getElementById('filtro-tipo-tareas');
    const filtroEstadoTareas = document.getElementById('filtro-estado-tareas');
    const filtroTipoEstado = document.getElementById('filtro-tipo-estado-tareas');
    
    // Ocultar T.Estado inicialmente
    filtroTipoEstado.parentElement.style.display = 'none';
    
    // Solo reaccionamos al cambio de Estado
    filtroEstadoTareas.addEventListener('change', () => {
        console.log('Estado seleccionado:', filtroEstadoTareas.value); // Mantener para debug
        if (filtroEstadoTareas.value === 'o') {
            filtroTipoEstado.parentElement.style.display = 'block';
        } else {
            filtroTipoEstado.parentElement.style.display = 'none';
            filtroTipoEstado.value = '';
        }
    });
});
