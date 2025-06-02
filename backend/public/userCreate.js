

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modalCrearUsuario');
    const openBtn = document.querySelector('.boton_crear');
    const cancelBtn = document.getElementById('cancelarModal');
    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');

    openBtn.addEventListener('click', () => modal.style.display = 'flex');
    cancelBtn.addEventListener('click', () => modal.style.display = 'none');

    togglePassword.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        togglePassword.querySelector('i').classList.toggle('fa-eye');
        togglePassword.querySelector('i').classList.toggle('fa-eye-slash');
    });
    

    const form = document.getElementById('createUserForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const userData = {
            firstName: form.firstName.value,
            lastName: form.lastName.value,
            login: form.login.value,
            email: form.email.value,
            password: form.password.value
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
            } else {
                const data = await res.json();
                alert('Error: ' + (data.message || 'Desconocido'));
            }
        } catch (err) {
            alert('Error de conexión al servidor');
        }
    });
});