document.addEventListener('DOMContentLoaded', () => {
    const usuariosGroup = document.getElementById('usuarios-group');

    const botonCrear = document.querySelector('.boton_crear');

    if (botonCrear) {
        botonCrear.addEventListener('click', () => {
            window.location.href = 'createUser.html';
        });
    }
});