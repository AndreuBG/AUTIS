import './components/ProjectCard.js';
import './components/TaskCard.js';
import './components/TabButton.js';
import './components/UserCard.js';

document.addEventListener('DOMContentLoaded', async () => {
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

        const ctxBarras = document.getElementById('graficoBarras').getContext('2d');
        new Chart(ctxBarras, {
            type: 'bar',
            data: {
                labels: ['Web App', 'API', 'Mobile', 'Soporte Interno'],
                datasets: [{
                    label: 'Horas Por Proyecto',
                    data: [19, 5, 10, 5],
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

        const ctxCircular = document.getElementById('graficoCircular').getContext('2d');
        new Chart(ctxCircular, {
            type: 'pie',
            data: {
                labels: ['EQUIPO 1', 'EQUIPO 2', 'EQUIPO 3',],
                datasets: [{
                    label: 'Carga de Trabajo del Equipo',
                    data: [20, 30, 50],
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 206, 86)'
                    ],
                    borderColor: [
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
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });

    } catch(error) {
        console.error(error)
    }
    
});