import {ShowMyAlert} from "../my_alert.js";

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal-crear-proyecto');
    const openBtn = document.getElementById('boton-crear-proyectos');
    const cancelBtn = document.getElementById('cancelar-crear-proyecto');
    const form = document.getElementById('form-crear-proyecto');

    openBtn.addEventListener('click', () => {
        console.log("Abrir modal de creación de proyecto");
        modal.style.display = 'flex';
    });

    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        form.reset();
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const identifier = document.getElementById('identifier-crear').value;
        const identifierPattern = /^[a-z][a-z0-9-]*$/;

        if (!identifierPattern.test(identifier) || identifier.length > 100) {
            alert('Error: El identificador debe comenzar con una letra minúscula y solo puede contener letras minúsculas, números y guiones. Máximo 100 caracteres.');
            return;
        }

        const projectData = {
            name: document.getElementById('name-crear').value,
            identifier: identifier,
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
                modal.style.display = 'none';
                form.reset();
                ShowMyAlert('success','Proyecto creado exitosamente');
                setTimeout(() => {
                    location.reload();
                }, 1500); // recarga tras mostrar el alert

            } else {
                const data = await res.json();
                ShowMyAlert('error', `Error: ${data.message || 'Error desconocido'}`);
                alert(`Error: ${data?.message || 'No se pudo crear el proyecto'}`);
            }
        } catch (error) {
            ShowMyAlert('error', 'Error de conexión al servidor');
            console.error('Error creando proyecto:', error.message);
        }
    });
            alert('Error de conexión al servidor');
            console.error('Error creando proyecto:', error);
        }
    });

    // Función para actualizar la lista de proyectos
    async function actualizarListaProyectos() {
        try {
            const response = await fetch('http://localhost:5500/projects');
            if (!response.ok) throw new Error('Error al obtener proyectos');
            
            const proyectos = await response.json();
            const contenedorProyectos = document.getElementById('proyectos');
            
            // Limpiar el contenedor actual
            contenedorProyectos.innerHTML = '';
            
            // Agregar los proyectos actualizados
            proyectos.forEach(proyecto => {
                const proyectoElement = document.createElement('div');
                proyectoElement.className = 'proyecto-card';
                proyectoElement.innerHTML = `
                    <h3>${proyecto.name}</h3>
                    <p>ID: ${proyecto.identifier}</p>
                    <p>${proyecto.description?.raw || 'Sin descripción'}</p>
                `;
                contenedorProyectos.appendChild(proyectoElement);
            });
        } catch (error) {
            console.error('Error actualizando lista de proyectos:', error);
        }
    }
});