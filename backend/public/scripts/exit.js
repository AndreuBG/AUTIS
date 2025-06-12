document.addEventListener('DOMContentLoaded', () => {
    const cerrarSesion = document.getElementById('cerrarSesion');
    cerrarSesion.addEventListener('click', () => {
        localStorage.removeItem('token');
        console.log('Cerrando sesión...');
        window.location.href = '/pages/index.html';
    });
})
