document.addEventListener('DOMContentLoaded', () => {
    const botonProyectos = document.getElementById('aplicar-filtro-proyectos');
    const botonTareas = document.getElementById('aplicar-filtro-tareas');
    const botonUsuarios = document.getElementById('aplicar-filtro-usuarios');

    botonUsuarios.addEventListener('click', async () => {
        const estado = document.getElementById('filtro-estado-usuarios').value;
        const filtros = [];

        if (estado !== '') {
            filtros.push({ status: { operator: '=', values: [estado] } });
        }

        const filtrosTXT = JSON.stringify(filtros);
        const listaUsuarios = document.getElementById('users');

        try {
            const response = await fetch(`/getUsersFiltered/${filtrosTXT}`);
            const usuariosFiltrados = await response.json();

            if (usuariosFiltrados.length === 0) {
                listaUsuarios.innerHTML = `
          <div class="no-results">
            <div class="message-container">
              <i class="fas fa-user-slash"></i>
              <p>No hay usuarios que cumplan con este filtro</p>
            </div>
          </div>`;
            } else {
                listaUsuarios.innerHTML = '';
                usuariosFiltrados.forEach((u) => {
                    const userElement = document.createElement('user-card');
                    userElement.setAttribute('id', u.id);
                    userElement.setAttribute('active', u.active);
                    userElement.setAttribute('name', u.name);
                    userElement.setAttribute('login', u.login);
                    userElement.setAttribute('email', u.email);
                    listaUsuarios.appendChild(userElement);
                });
            }
        } catch (error) {
            console.error('Error cargando usuarios filtrados:', error.message);
        }
    });

    botonTareas.addEventListener('click', async () => {
        const tipo = document.getElementById('filtro-tipo-tareas').value;
        const estado = document.getElementById('filtro-estado-tareas').value;
        const prioridad = document.getElementById('filtro-Prioridad-tareas').value;
        const tipoEstado = document.getElementById('filtro-tipo-estado-tareas').value;
        let currentPage = 1;
        const pageSize = 16;
        const filtros = [];

        if (estado !== '') {
            filtros.push({ status_id: { operator: estado, values: null } });
        }
        if (tipo !== '') {
            filtros.push({ type_id: { operator: '=', values: [tipo] } });
        }
        if (prioridad !== '') {
            filtros.push({ priority: { operator: '=', values: [prioridad] } });
        }

        if (tipoEstado !== '') {
            filtros.push({ status_id: {"operator": "=", "values": [tipoEstado]} });
        }

        const ordenarPor = document.getElementById('orden-tareas').value;
        const ordenarDireccion = document.getElementById('ordenacion-tareas').value;

        const filtrosTXT = JSON.stringify(filtros);

        async function cargarTareasFiltradas(pagina) {
            try {
                // Calcular el offset correcto (página 1 = offset 1)
                const offset = pagina;
                const response = await fetch(`/getTasksFiltered/${filtrosTXT}/${ordenarPor}/${ordenarDireccion}?pageSize=${pageSize}&offset=${offset}`);
                const tareasFiltradas = await response.json();
                const listaTareas = document.getElementById('tareas');

                if (tareasFiltradas.length === 0) {
                    listaTareas.innerHTML = `
                        <div class="no-results">
                            <div class="message-container">
                                <i class="fas fa-tasks"></i>
                                <p>No hay tareas que cumplan con este filtro</p>
                            </div>
                        </div>`;
                    return;
                }

                listaTareas.innerHTML = '';
                tareasFiltradas.forEach((t) => {
                    const taskElement = document.createElement('task-card');
                    Object.entries({
                        id: t.id,
                        subject: t.subject,
                        description: t.description,
                        startDate: t.startDate,
                        dueDate: t.dueDate,
                        project: t.project,
                        type: t.type,
                        priority: t.priority
                    }).forEach(([key, value]) => taskElement.setAttribute(key, value || ''));
                    listaTareas.appendChild(taskElement);
                });

                document.getElementById('pagina-actual').textContent = pagina;
                currentPage = pagina;
                
                // Actualizar estado de los botones
                document.getElementById('anterior').disabled = pagina <= 1;
                document.getElementById('siguiente').disabled = tareasFiltradas.length < pageSize;
            } catch (error) {
                console.error('Error cargando tareas filtradas:', error.message);
            }
        }

        // Inicializar paginación
        await cargarTareasFiltradas(1);

        // Remover listeners anteriores
        const anterior = document.getElementById('anterior');
        const siguiente = document.getElementById('siguiente');
        
        anterior.replaceWith(anterior.cloneNode(true));
        siguiente.replaceWith(siguiente.cloneNode(true));

        // Agregar nuevos listeners
        document.getElementById('anterior').addEventListener('click', () => {
            if (currentPage > 1) {
                cargarTareasFiltradas(currentPage - 1);
            }
        });

        document.getElementById('siguiente').addEventListener('click', () => {
            cargarTareasFiltradas(currentPage + 1);
        });
    });

    botonProyectos.addEventListener('click', async () => {
        const activo = document.getElementById('filtro-actividad-proyectos').value;
        const filtros = [];

        if (activo !== '') {
            filtros.push({ active: { operator: '=', values: [activo] } });
        }

        const filtrosTXT = JSON.stringify(filtros);
        const listaProyectos = document.getElementById('proyectos');

        const ordenarPor = document.getElementById('orden-proyectos').value;
        const ordenarDireccion = document.getElementById('ordenacion-proyectos').value;

        try {
            const response = await fetch(`/getProjectsFiltered/${filtrosTXT}/${ordenarPor}/${ordenarDireccion}`);
            const proyectosFiltrados = await response.json();

            if (proyectosFiltrados.length === 0) {
                listaProyectos.innerHTML = `
          <div class="no-results">
            <div class="message-container">
              <i class="fas fa-folder-open"></i>
              <p>No hay proyectos que cumplan con este filtro</p>
            </div>
          </div>`;
            } else {
                listaProyectos.innerHTML = '';
                proyectosFiltrados.forEach((p) => {
                    const projectElement = document.createElement('project-card');
                    projectElement.setAttribute('id', p.id);
                    projectElement.setAttribute('active', p.active);
                    projectElement.setAttribute('name', p.name);
                    projectElement.setAttribute('description', p.description);
                    listaProyectos.appendChild(projectElement);
                });
            }
        } catch (error) {
            console.error('Error cargando proyectos filtrados:', error.message);
        }
    });
});