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
        let paginaTareaActual = 1;
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

        const filtrosTXT = JSON.stringify(filtros);

        async function cargarTareasFiltradas(pagina) {
            try {
                const response = await fetch(`/getTasksFiltered/${filtrosTXT}?pageSize=${pageSize}&offset=${pagina}`);
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
                    if (pagina > 1) {
                        await cargarTareasFiltradas(pagina - 1);
                        return;
                    }
                } else {
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
                        }).forEach(([key, value]) => taskElement.setAttribute(key, value || ''));
                        listaTareas.appendChild(taskElement);
                    });
                }

                document.getElementById('pagina-actual').textContent = pagina;
                paginaTareaActual = pagina;

                document.getElementById('anterior').disabled = pagina <= 1;
                document.getElementById('siguiente').disabled = tareasFiltradas.length < pageSize;
            } catch (error) {
                console.error('Error cargando tareas filtradas:', error.message);
            }
        }

        await cargarTareasFiltradas(1);

        document.getElementById('anterior').addEventListener('click', () => {
            if (paginaTareaActual > 1) {
                cargarTareasFiltradas(paginaTareaActual - 1);
            }
        });

        document.getElementById('siguiente').addEventListener('click', () => {
            cargarTareasFiltradas(paginaTareaActual + 1);
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

        try {
            const response = await fetch(`/getProjectsFiltered/${filtrosTXT}`);
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