document.addEventListener('DOMContentLoaded', () => {
    const iconoFiltro = document.getElementById('icono-filtro-tareas');
    const filtroTareas = document.getElementById('filtro-tareas');
    const tareasGroup = document.getElementById('tareas-group');

    function checkResponsiveFiltro() {
        const tareasVisible = tareasGroup && tareasGroup.style.display !== 'none';
        if (window.innerWidth <= 700 && tareasVisible) {
            iconoFiltro.style.display = 'block';
            filtroTareas.style.display = 'none';
        } else {
            iconoFiltro.style.display = 'none';
            if (tareasVisible) {
                filtroTareas.style.display = 'block';
            } else {
                filtroTareas.style.display = 'none';
            }
        }
    }

    iconoFiltro.addEventListener('click', () => {
        if (filtroTareas.style.display === 'none' || filtroTareas.style.display === '') {
            filtroTareas.style.display = 'block';
            if (window.innerWidth <= 700) filtroTareas.classList.add('flotante');
            else filtroTareas.classList.remove('flotante');
        } else {
            filtroTareas.style.display = 'none';
        }
    });

    window.addEventListener('resize', checkResponsiveFiltro);

    // Observa los cambios de visibilidad de las secciones
    const observer = new MutationObserver(checkResponsiveFiltro);
    if (tareasGroup) {
        observer.observe(tareasGroup, { attributes: true, attributeFilter: ['style', 'class'] });
    }

    checkResponsiveFiltro();
});