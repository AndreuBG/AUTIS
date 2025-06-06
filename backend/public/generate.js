import './components/ProjectCard.js';
import './components/TaskCard.js';
import './components/TabButton.js';
import './components/UserCard.js';
import {Graficos} from "./graficos.js";

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await fetch('http://localhost:5500/postToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: localStorage.getItem('token') }),
        });
    } catch (error) {
        console.error('Error subiendo el token:', error.message);
    }

    try {
        // Obtener proyectos
        const responseProject = await fetch('/getProjects');
        const proyectos = await responseProject.json();

        // Obtener todas las tareas y hacerlas disponibles globalmente
        const responseAllTasks = await fetch('/getAllTasks');
        const todasLasTareas = await responseAllTasks.json();
        window.todasLasTareas = todasLasTareas;

        // Configuración de paginación
        let paginaTareaActual = 1;
        const pageSize = 16;

        // Obtener usuarios
        const responseUser = await fetch('/getUsers');
        const usuarios = await responseUser.json();

        // Renderizar proyectos
        const listaProyectos = document.getElementById('proyectos');
        proyectos.forEach((p) => {
            const projectElement = document.createElement('project-card');
            projectElement.setAttribute('id', p.id);
            projectElement.setAttribute('active', p.active);
            projectElement.setAttribute('name', p.name);
            projectElement.setAttribute('description', p.description);
            listaProyectos.appendChild(projectElement);
        });

        // Función para cargar tareas por página
        async function cargarTareasPagina(pagina) {
            try {
                const responseTask = await fetch(`/getTasks?pageSize=${pageSize}&offset=${pagina}`);
                if (!responseTask.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }

                const tareas = await responseTask.json();
                const listaTareas = document.getElementById('tareas');
                listaTareas.innerHTML = '';

                if (tareas.length === 0 && pagina > 1) {
                    await cargarTareasPagina(pagina - 1);
                    return;
                }

                tareas.forEach((t) => {
                    const taskElement = document.createElement('task-card');
                    Object.entries({
                        id: t.id,
                        type: t.type,
                        subject: t.subject,
                        description: t.description,
                        startDate: t.startDate,
                        dueDate: t.dueDate,
                        project: t.project,
                    }).forEach(([key, value]) => taskElement.setAttribute(key, value || ''));
                    listaTareas.appendChild(taskElement);
                });

                document.getElementById('pagina-actual').textContent = `${pagina}`;
                paginaTareaActual = pagina;

                document.getElementById('anterior').disabled = pagina <= 1;
                document.getElementById('siguiente').disabled = tareas.length < pageSize;
            } catch (error) {
                console.error('Error cargando tareas:', error.message);
            }
        }

        // Configurar eventos de paginación
        document.getElementById('anterior').addEventListener('click', () => {
            if (paginaTareaActual > 1) {
                cargarTareasPagina(paginaTareaActual - 1);
            }
        });

        document.getElementById('siguiente').addEventListener('click', () => {
            cargarTareasPagina(paginaTareaActual + 1);
        });

        // Cargar la primera página de tareas
        await cargarTareasPagina(1);

        // Renderizar usuarios
        const listaUsuarios = document.getElementById('users');
        usuarios.forEach((u) => {
            const userElement = document.createElement('user-card');
            userElement.setAttribute('id', u.id);
            userElement.setAttribute('active', u.active);
            userElement.setAttribute('name', u.name);
            userElement.setAttribute('login', u.login);
            userElement.setAttribute('email', u.email);
            listaUsuarios.appendChild(userElement);
        });

        // Generar gráficos
        try {
            await Graficos.generarGraficos();
        } catch (error) {
            console.error('Error generando gráficos:', error);
        }

        // Manejo del botón de cerrar sesión
        const cerrarSesion = document.getElementById('cerrarSesion');
        cerrarSesion.addEventListener('click', () => {
            localStorage.removeItem('token');
            console.log('Cerrando sesión...');
            window.location.href = '/pages/index.html';
        });

        // Renderizar entradas de tiempo
        try {
            const responseTimeEntries = await fetch('/getTimeEntries');
            const timeEntries = await responseTimeEntries.json();
            const dashboardDiv = document.getElementById('dashboard-time-entries');

            if (dashboardDiv) {
                dashboardDiv.innerHTML = `
          <style>
            #dashboard-time-entries {
              padding: 0 16px;
              box-sizing: border-box;
            }
            .time-entries-wrapper {
              width: 100%;
              overflow-x: auto;
              margin: 16px 0 32px;
              box-sizing: border-box;
            }
            .time-entries-table {
              width: 100%;
              min-width: 600px;
              border-collapse: collapse;
              background: #fff;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
              border-radius: 8px;
              font-size: 1em;
            }
            .time-entries-table th,
            .time-entries-table td {
              padding: 10px 14px;
              text-align: left;
              white-space: nowrap;
            }
            .time-entries-table th {
              background: #0a28d1;
              color: #fff;
              font-weight: bold;
              border-bottom: 2px solid #0a28d1;
            }
            .time-entries-table tr:nth-child(even) {
              background: #f4f6fa;
            }
            .time-entries-table tr:hover {
              background: #e2e8f0;
            }
            .time-entries-table td {
              border-bottom: 1px solid #e0e0e0;
            }
            .time-entries-title {
              color: #0a28d1;
              margin: 24px 8px 16px 10px;
              font-size: 1.4em;
              font-weight: bold;
            }
            @media (max-width: 700px) {
              .time-entries-table,
              .time-entries-table thead,
              .time-entries-table tbody,
              .time-entries-table tr,
              .time-entries-table th,
              .time-entries-table td {
                display: block;
                width: 100%;
              }
              .time-entries-table thead {
                display: none;
              }
              .time-entries-table tr {
                margin-bottom: 16px;
                box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
                border-radius: 6px;
                background: #fff;
                padding: 10px 0;
              }
              .time-entries-table td {
                border: none;
                position: relative;
                padding-left: 50%;
                white-space: normal;
                min-height: 32px;
              }
              .time-entries-table td:before {
                position: absolute;
                left: 16px;
                top: 10px;
                width: 45%;
                white-space: normal;
                font-weight: bold;
                color: #0a28d1;
                content: attr(data-label);
              }
            }
          </style>
          <h2 class="time-entries-title">Entradas de Tiempo</h2>
          <div class="time-entries-wrapper">
            <table class="time-entries-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Proyecto</th>
                  <th>Usuario</th>
                  <th>Horas</th>
                  <th>Comentarios</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                ${timeEntries
                    .map(
                        (entry) => `
                  <tr>
                    <td data-label="ID">${entry.id}</td>
                    <td data-label="Proyecto">${entry._links.project?.title || ''}</td>
                    <td data-label="Usuario">${entry._links.user?.title || ''}</td>
                    <td data-label="Horas">${entry.hours || ''}</td>
                    <td data-label="Comentarios">${entry.comment?.raw || ''}</td>
                    <td data-label="Fecha">${entry.spentOn || ''}</td>
                  </tr>
                `
                    )
                    .join('')}
              </tbody>
            </table>
          </div>
        `;
            }
        } catch (error) {
            console.error('Error cargando time entries:', error);
        }
    } catch (error) {
        console.error('Error en la carga inicial:', error.message);
    }
});