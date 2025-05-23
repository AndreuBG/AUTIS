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

        const token = document.getElementById('api-token').value;
        
          const response = await fetch(`http://localhost:8080/api/v3/projects`, {
                headers: {
                'Authorization': 'Basic ' + btoa(`apikey:${token}`)
                }
            }) 

        if (!response.ok) {
            alert("Credenciales incorrectas!");
        } else {
            sessionStorage.setItem('token', token);
            window.location.assign("/pages/main.html")

        }

    });