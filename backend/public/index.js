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

        const formData = new FormData(form);
        const datosFormulario = {
            token: formData.get('api-token'),
            recordar: formData.get('recordarPasswd')
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
            window.location.href = "/pages/main.html";
        } else {
            alert(data.error || "Error durante el login");
        }


    });


