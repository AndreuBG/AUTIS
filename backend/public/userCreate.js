document.addEventListener('DOMContentLoaded', () => {
    console.log('Script cargado');
    const usuariosGroup = document.getElementById('usuarios-group');
    console.log('usuarios-group:', usuariosGroup);

    const botonCrear = document.querySelector('.boton_crear');
    console.log('boton crear:', botonCrear);

    if (botonCrear) {
        botonCrear.addEventListener('click', () => {
            console.log('Botón clickeado');
            window.location.href = 'createUser.html';
        });
    }
});