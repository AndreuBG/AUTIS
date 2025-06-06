document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal-crear-proyecto');
    const openBtn = document.getElementById('boton-crear-proyectos');
    const cancelBtn = document.getElementById('cancelar-crear-proyecto');
    const form = document.getElementById('form-crear-proyecto');

    openBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        form.reset();
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const projectData = {
            name: document.getElementById('name-crear').value,
            identifier: document.getElementById('identifier-crear').value,
            description: {
                raw: document.getElementById('description-crear').value
            },
        };

        try {
            const res = await fetch('http://localhost:5500/createProject', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(projectData),
            });

            if (res.ok) {
                alert('Proyecto creado exitosamente');
                modal.style.display = 'none';
                form.reset();
                location.reload();
            } else {
                const data = await res.json();
                alert(`Error: ${data.message || 'Error desconocido'}`);
            }
        } catch (error) {
            alert('Error de conexión al servidor');
            console.error('Error creando proyecto:', error.message);
        }
    });
});