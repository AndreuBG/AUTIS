document.getElementById('menu-hamburguesa').onclick = function(e) {
    e.stopPropagation();
    const menuLateral = document.getElementById('menu-lateral');
    menuLateral.classList.toggle('show');
    document.body.classList.toggle('no-scroll');
    document.body.classList.toggle('menu-abierto'); 
};

document.addEventListener('click', function(e) {
    const menu = document.getElementById('menu-lateral');
    const burger = document.getElementById('menu-hamburguesa');
    if (menu.classList.contains('show') && !menu.contains(e.target) && !burger.contains(e.target)) {
        menu.classList.remove('show');
        document.body.classList.remove('no-scroll');
        document.body.classList.remove('menu-abierto'); 
    }
});

document.querySelectorAll('#cerrarSesion, #cerrarSesionLateral').forEach(btn => {
    btn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/pages/index.html';
    });
});

document.querySelectorAll('#menu-lateral tab-button').forEach(btn => {
    btn.addEventListener('click', () => {
        document.getElementById('menu-lateral').classList.remove('show');
        document.body.classList.remove('no-scroll');
        document.body.classList.remove('menu-abierto');
    });
});

document.getElementById('cerrarMenuLateral').onclick = function() {
    document.getElementById('menu-lateral').classList.remove('show');
    document.body.classList.remove('no-scroll');
    document.body.classList.remove('menu-abierto'); 
};