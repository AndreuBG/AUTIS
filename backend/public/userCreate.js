document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal-crear-usuario');
    const openBtn = document.querySelector('.boton_crear');
    const cancelBtn = document.getElementById('cancelar-crear');
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

    // Toggle password visibility
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
                alert('Usuario creado exitosamente');
                modal.style.display = 'none';
                form.reset();
                location.reload(); // Recargar para mostrar el nuevo usuario
            } else {
                const data = await res.json();
                alert('Error: ' + (data.message || 'Error desconocido'));
            }
        } catch (error) {
            alert('Error de conexión al servidor');
        }
    });
});

