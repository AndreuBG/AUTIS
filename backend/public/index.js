function togglePassword() {
    const passwordInput = document.getElementById('api-token');
    const toggleButton = document.getElementById('toggle-password');
    const icon = toggleButton.querySelector('i');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

function clearPassword() {
    const passwordInput = document.getElementById('api-token');
    passwordInput.value = '';
    passwordInput.focus();
}

const form = document.getElementById('api-token-login');
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = document.getElementById('api-token')
    const recordarCheck = document.getElementById('recordarPasswd');

    const datosFormulario = {
        token: token.value,
        recordar: recordarCheck.checked
    }


    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datosFormulario)
    })

    if (!response.ok) {
        alert("Credenciales incorrectas!");
    }

    const data = await response.json();

    if (data.success) {
        if (recordarCheck.checked) localStorage.setItem('token', token.value)
        window.location.href = "/pages/main.html";
    } else {
        alert(data.error || "Error durante el login");
    }


});