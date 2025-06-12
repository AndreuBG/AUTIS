document.addEventListener('DOMContentLoaded', () => {
    const iconoFiltroProyectos = document.getElementById('icono-filtro-proyectos');
    const filtroProyectos = document.getElementById('filtro-proyectos');

    function checkResponsiveFiltroProyectos() {
        if (window.innerWidth <= 700) {
            iconoFiltroProyectos.style.display = 'block';
            filtroProyectos.querySelector('.filtro-menu').style.display = 'none';
        } else {
            iconoFiltroProyectos.style.display = 'none';
            filtroProyectos.querySelector('.filtro-menu').style.display = 'flex';
        }
    }

    iconoFiltroProyectos.addEventListener('click', () => {
        const menu = filtroProyectos.querySelector('.filtro-menu');
        if (menu.style.display === 'none' || menu.style.display === '') {
            menu.style.display = 'flex';
            menu.classList.add('flotante');
        } else {
            menu.style.display = 'none';
            menu.classList.remove('flotante');
        }
    });

    window.addEventListener('resize', checkResponsiveFiltroProyectos);
    checkResponsiveFiltroProyectos();
});