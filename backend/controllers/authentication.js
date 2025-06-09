
export async function login(form){
    try {
        const response = await fetch(`http://localhost:8080/api/v3/projects`, {
            headers: {
                'Authorization': 'Basic ' + btoa(`apikey:${form.token}`)
            }
        });

        if (response.ok) {
            const responsePost = await fetch('http://localhost:5500/postToken', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ token: form.token }) 
            });

            if (responsePost.ok) {
                return { success: true };
            } else {
                throw new Error('Error al guardar el token');
            }
        } else {
            throw new Error('Credenciales incorrectas');
        }
    } catch (error) {
        console.error('Error durante el login:', error);
        return { success: false, error: error.message };
    }
}