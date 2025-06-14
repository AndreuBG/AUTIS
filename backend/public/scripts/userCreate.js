import {ShowMyAlert} from "../js/my_alert.js";

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal-crear-usuario');
    const openBtn = document.getElementById('boton-crear-usuarios');
    const cancelBtn = document.getElementById('cancelar-crear-usuario');
    const form = document.getElementById('form-crear-usuario');
    const togglePassword = document.getElementById('toggle-password-crear');
    const passwordInput = document.getElementById('password-crear');

    openBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        form.reset();
    });

    togglePassword.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        togglePassword.querySelector('i').classList.toggle('fa-eye');
        togglePassword.querySelector('i').classList.toggle('fa-eye-slash');
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const userData = {
            firstName: document.getElementById('firstName-crear').value,
            lastName: document.getElementById('lastName-crear').value,
            login: document.getElementById('login-crear').value,
            email: document.getElementById('email-crear').value,
            password: document.getElementById('password-crear').value,
            status: document.getElementById('status-crear').value || 'active'
        };

        try {
            const res = await fetch('http://localhost:5500/createUser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            if (res.ok) {
                modal.style.display = 'none';
                form.reset();
                ShowMyAlert('success', 'Usuario creado exitosamente');
                setTimeout(() => {
                    location.reload();
                    }, 1500); // recarga tras mostrar el alert

            } else {
                const data = await res.json();
                ShowMyAlert('error', 'Error: ' + (data.message || 'Error desconocido'));
            }
        } catch (error) {
            ShowMyAlert('error', 'Error de conexión al servidor');
        }
    });
});

