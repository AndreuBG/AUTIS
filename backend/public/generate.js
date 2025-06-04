import './components/ProjectCard.js';
import './components/TaskCard.js';
import './components/TabButton.js';
import './components/UserCard.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await fetch('http://localhost:5500/postToken', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({token: localStorage.getItem('token')})
        });
    } catch (error) {
        console.error("Error subiendo el token: " + error.message);
    }

    try {
        const responseProject = await fetch('/getProjects');
        const proyectos = await responseProject.json();

        // Obtener TODAS las tareas primero
        const responseAllTasks = await fetch('/getAllTasks');
        const todasLasTareas = await responseAllTasks.json();
        
        // Hacer disponibles las tareas globalmente
        window.todasLasTareas = todasLasTareas;

        // Resto del código de paginación
        let paginaTareaActual = 1;
        const pageSize = 16;

        const responseUser = await fetch('/getUsers');
        const usuarios = await responseUser.json();

        const listaProyectos = document.getElementById('proyectos');
        proyectos.forEach(p => {
            const projectElement = document.createElement('project-card');
            projectElement.setAttribute('id', p.id);
            projectElement.setAttribute('active', p.active  );
            projectElement.setAttribute('name', p.name);
            projectElement.setAttribute('description', p.description);

            listaProyectos.appendChild(projectElement);
        });

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

                tareas.forEach(t => {
                    const taskElement = document.createElement('task-card');
                    // Mantener solo un setAttribute por propiedad
                    Object.entries({
                        id: t.id,
                        type: t.type,
                        subject: t.subject,
                        description: t.description,
                        startDate: t.startDate,
                        dueDate: t.dueDate,
                        project: t.project
                    }).forEach(([key, value]) => taskElement.setAttribute(key, value || ''));

                    listaTareas.appendChild(taskElement);
                });

                document.getElementById('pagina-actual').textContent = `${pagina}`;
                paginaTareaActual = pagina;

                document.getElementById('anterior').disabled = pagina <= 1;
                document.getElementById('siguiente').disabled = tareas.length < pageSize;
            } catch (error) {
                console.error("Error cargando tareas:", error.message);
            }
        }

        //Evento de los botones de paginación
        document.getElementById('anterior').addEventListener('click', () => {
            if (paginaTareaActual > 1) {
                cargarTareasPagina(paginaTareaActual - 1);
            }
        });

        document.getElementById('siguiente').addEventListener('click', () => {
            cargarTareasPagina(paginaTareaActual + 1);
        });

        // Cargar la primera página de tareas al inicio
        await cargarTareasPagina(1);

        const listaUsuarios = document.getElementById('users');
        usuarios.forEach(u => {
            const userElement = document.createElement('user-card');
            userElement.setAttribute('id', u.id);
            userElement.setAttribute('active', u.active  );
            userElement.setAttribute('name', u.name);
            userElement.setAttribute('login', u.login);
            userElement.setAttribute('email', u.email);

            listaUsuarios.appendChild(userElement);
        });

        const filtroContainer = document.getElementById('filtro-proyectos');

        // Generar los datos para los gráficos con los proyectos y las tareas
        const proyectosLabels = proyectos.map(p => p.name);
        const tareasPorProyecto = proyectos.map(p => todasLasTareas.filter(t => t.project === p.name).length);

        // Configurar el gráfico de barras: Horas por proyecto
        const ctxBarras = document.getElementById('graficoBarras').getContext('2d');
        new Chart(ctxBarras, {
            type: 'bar',
            data: {
                labels: proyectosLabels,
                datasets: [{
                    label: 'Tareas Por Proyecto',
                    data: tareasPorProyecto, // Datos dinámicos de tareas por proyecto
                    backgroundColor: 'rgb(10, 40, 209)',
                    borderColor: 'rgb(0, 0, 0)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            font: {
                                weight: 'bold'
                            }
                        }
                    }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });

        // Configurar el gráfico circular: Carga de trabajo por proyecto
        const ctxCircular = document.getElementById('graficoCircular').getContext('2d');
        new Chart(ctxCircular, {
            type: 'pie',
            data: {
                labels: proyectosLabels,
                datasets: [{
                    label: 'Carga de Trabajo por Proyecto',
                    data: tareasPorProyecto, // Carga de trabajo representada por el número de tareas
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 206, 86)',
                        'rgb(75, 192, 192)',
                        'rgb(153, 102, 255)',
                        'rgb(255, 159, 64)'
                    ],
                    borderColor: [
                        'rgb(0, 0, 0)',
                        'rgb(0, 0, 0)',
                        'rgb(0, 0, 0)',
                        'rgb(0, 0, 0)',
                        'rgb(0, 0, 0)',
                        'rgb(0, 0, 0)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            font: {
                                weight: 'bold'
                            }
                        }
                    }
                }
            }
        });

    } catch(error) {
        console.error(error)
    }

    const filtroMenu = document.getElementById('filtro-menu');

    const cerrarSesion = document.getElementById('cerrarSesion');
    cerrarSesion.addEventListener('click', () => {
        localStorage.removeItem('token');
        console.log("Cerrando sesion...");
        window.location.href = '/pages/index.html';
    })
    
    try {
        const responseTimeEntries = await fetch('/getTimeEntries');
        const timeEntries = await responseTimeEntries.json();

        const dashboardDiv = document.getElementById('dashboard-time-entries');
        if (dashboardDiv) {
            dashboardDiv.innerHTML = `
                <style>
                    #dashboard-time-entries {
                        padding-left: 16px;
                        padding-right: 16px;
                        box-sizing: border-box;
                    }
                    .time-entries-wrapper {
                        width: 100%;
                        overflow-x: auto;
                        margin-top: 16px;
                        margin-bottom: 32px;
                        box-sizing: border-box;
                    }
                    .time-entries-table {
                        width: 100%;
                        min-width: 600px;
                        border-collapse: collapse;
                        background: #fff;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                        border-radius: 8px;
                        overflow: hidden;
                        font-size: 1em;
                    }
                    .time-entries-table th, .time-entries-table td {
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
                        margin-bottom: 16px;
                        margin-top: 24px;
                        font-size: 1.4em;
                        font-weight: bold;
                        margin-left: 10px;
                        margin-right: 8px;
                    }
                    @media (max-width: 700px) {
                        .time-entries-table, .time-entries-table thead, .time-entries-table tbody, .time-entries-table tr, .time-entries-table th, .time-entries-table td {
                            display: block;
                            width: 100%;
                        }
                        .time-entries-table thead {
                            display: none;
                        }
                        .time-entries-table tr {
                            margin-bottom: 16px;
                            box-shadow: 0 1px 4px rgba(0,0,0,0.07);
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
                            ${timeEntries.map(entry => `
                                <tr>
                                    <td data-label="ID">${entry.id}</td>
                                    <td data-label="Proyecto">${entry._links.project && entry._links.project.title ? entry._links.project.title : ''}</td>
                                    <td data-label="Usuario">${entry._links.user && entry._links.user.title ? entry._links.user.title : ''}</td>
                                    <td data-label="Horas">${entry.hours}</td>
                                    <td data-label="Comentarios">${entry.comment && entry.comment.raw ? entry.comment.raw : ''}</td>
                                    <td data-label="Fecha">${entry.spentOn || ''}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
    } catch (error) {
        console.error("Error cargando time entries:", error);
    }

    // Modificar el getRelatedTasksHtml en ProjectCard.js para usar todasLasTareas
    window.todasLasTareas = todasLasTareas; // Hacer disponible para ProjectCard

});

