document.getElementById('menu-hamburguesa').onclick = function(e) {
    e.stopPropagation();
    document.getElementById('menu-lateral').classList.toggle('show');
    document.body.classList.toggle('no-scroll');
};
// Cierra el menú si haces clic fuera
document.addEventListener('click', function(e) {
    const menu = document.getElementById('menu-lateral');
    const burger = document.getElementById('menu-hamburguesa');
    if (menu.classList.contains('show') && !menu.contains(e.target) && !burger.contains(e.target)) {
        menu.classList.remove('show');
        document.body.classList.remove('no-scroll');
    }
});

// Cerrar sesión desde ambos iconos
document.querySelectorAll('#cerrarSesion, #cerrarSesionLateral').forEach(btn => {
    btn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/pages/index.html';
    });
});

// Ocultar menú lateral al pulsar cualquier tab-button dentro del menú lateral
document.querySelectorAll('#menu-lateral tab-button').forEach(btn => {
    btn.addEventListener('click', () => {
        document.getElementById('menu-lateral').classList.remove('show');
        document.body.classList.remove('no-scroll');
    });
});

document.getElementById('cerrarMenuLateral').onclick = function() {
    document.getElementById('menu-lateral').classList.remove('show');
    document.body.classList.remove('no-scroll');
};

