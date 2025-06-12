document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica de mostrar/ocultar proyectos inactivos (tu código original) ---
    const filtroActividad = document.getElementById('filtro-actividad-proyectos');
    const proyectosContainer = document.getElementById('proyectos');
    const botonAplicarFiltro = document.querySelector('#filtro-proyectos .aplicar-filtro');

    if (botonAplicarFiltro && filtroActividad && proyectosContainer) {
        botonAplicarFiltro.addEventListener('click', () => {
            const actividadSeleccionada = filtroActividad.value;

            if (actividadSeleccionada === 'inactivo') {
                proyectosContainer.style.display = 'none';

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

                    proyectosContainer.parentNode.insertBefore(mensajeInactivo, proyectosContainer.nextSibling);
                }
            } else {
                proyectosContainer.style.display = 'grid';

                const mensajeExistente = document.getElementById('mensaje-inactivo');
                if (mensajeExistente) {
                    mensajeExistente.remove();
                }
            }

            // Oculta el filtro después de aplicar (solo en móvil)
            if (window.innerWidth <= 700) {
                const filtroProyectos = document.getElementById('filtro-proyectos');
                filtroProyectos.style.display = 'none';
                const menu = filtroProyectos.querySelector('.filtro-menu');
                if (menu) menu.style.display = 'none'; // <-- Añade esto
                filtroProyectos.classList.remove('flotante');
            }
        });
    }

    // --- Lógica de mostrar/ocultar filtros responsive como tareas ---
    const iconoFiltro = document.getElementById('icono-filtro-proyectos');
    const filtroProyectos = document.getElementById('filtro-proyectos');
    const proyectosGroup = document.getElementById('proyectos-group');

    function checkResponsiveFiltroProyectos() {
        const proyectosVisible = proyectosGroup && proyectosGroup.style.display !== 'none';
        if (window.innerWidth <= 700 && proyectosVisible) {
            iconoFiltro.style.display = 'block';
            filtroProyectos.style.display = 'none';
        } else {
            iconoFiltro.style.display = 'none';
            if (proyectosVisible) {
                filtroProyectos.style.display = 'block';
            } else {
                filtroProyectos.style.display = 'none';
            }
        }
    }

    iconoFiltro.addEventListener('click', () => {
        const menu = filtroProyectos.querySelector('.filtro-menu');
        if (filtroProyectos.style.display === 'none' || filtroProyectos.style.display === '') {
            filtroProyectos.style.display = 'block';
            if (menu) menu.style.display = 'flex'; // <-- Añade esto
            if (window.innerWidth <= 700) 
                filtroProyectos.classList.add('flotante');
            else 
                filtroProyectos.classList.remove('flotante');
        } else {
            filtroProyectos.style.display = 'none';
            if (menu) menu.style.display = 'none'; // <-- Añade esto
            filtroProyectos.classList.remove('flotante');
        }
    });

    window.addEventListener('resize', checkResponsiveFiltroProyectos);

    // Observa cambios de visibilidad del grupo de proyectos
    const observer = new MutationObserver(checkResponsiveFiltroProyectos);
    if (proyectosGroup) {
        observer.observe(proyectosGroup, { attributes: true, attributeFilter: ['style', 'class'] });
    }

    checkResponsiveFiltroProyectos();
});
