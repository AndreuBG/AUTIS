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

        const responseTask = await fetch('/getTasks');
        const tareas = await responseTask.json();

        const responseUser = await fetch('/getUsers');
        const usuarios = await responseUser.json();


            // Añadir los proyectos al div
            const listaProyectos = document.getElementById('proyectos');
            proyectos.forEach(p => {
                const projectElement = document.createElement('project-card');
                projectElement.setAttribute('id', p.id);
                projectElement.setAttribute('active', p.active  );
                projectElement.setAttribute('name', p.name);
                projectElement.setAttribute('description', p.description);

                listaProyectos.appendChild(projectElement);
            });

            // Añadir las tareas
            const listaTareas = document.getElementById('tareas');
            tareas.forEach(t => {
                const taskElement = document.createElement('task-card');
                taskElement.setAttribute('id', t.id);
                taskElement.setAttribute('subject', t.subject);
                taskElement.setAttribute('description', t.description);
                taskElement.setAttribute('startDate', t.startDate);
                taskElement.setAttribute('dueDate', t.dueDate);
                taskElement.setAttribute('project', t.project);

                listaTareas.appendChild(taskElement);
            });

        const listaUsuarios = document.getElementById('users');
        usuarios.forEach(u => {
            const userElement = document.createElement('user-card');
            userElement.setAttribute('id', u.id);
            userElement.setAttribute('active', u.active  );
            userElement.setAttribute('name', u.name);
            userElement.setAttribute('description', u.description);

            listaUsuarios.appendChild(userElement);
        });

        const filtroContainer = document.getElementById('filtro-proyectos');

        // Generar los datos para los gráficos con los proyectos y las tareas
        const proyectosLabels = proyectos.map(p => p.name);
        const tareasPorProyecto = proyectos.map(p => tareas.filter(t => t.project === p.name).length);

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
    filtroMenu.innerHTML = `<label>
                Estado:
                <select id="filtro-estado">
                    <option value="">Todos</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="en_progreso">En progreso</option>
                    <option value="completado">Completado</option>
                </select>
            </label>
            <label>
                Responsable:
                <select id="filtro-responsable">
                    <option value="todos">Todos</option>
                    <option value="jefe">Jefe de proyecto</option>
                    <option value="empleados">Empleados</option>
                </select>
            </label>
            <button id="aplicar-filtro">Aplicar filtro</button>`

    const cerrarSesion = document.getElementById('cerrarSesion');
    cerrarSesion.addEventListener('click', () => {
        localStorage.removeItem('token');
        console.log("Cerrando sesion...");
        window.location.href = '/pages/index.html';
    })
    
});

