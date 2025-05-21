import { OpenProjectService } from "./OpenProjectService.js";
import './components/ProjectCard.js';
import './components/TaskCard.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const proyectos = await OpenProjectService.getAllProjects();
        const tareas = await OpenProjectService.getAllTasks();

        const listaTareas = document.getElementById('tareas');
                tareas.forEach(t => {
                    const taskElement = document.createElement('task-card');
                    taskElement.setAttribute('id', t.id);
                    taskElement.setAttribute('subject', t.subject);
                    taskElement.setAttribute('description', t.description);
                    taskElement.setAttribute('start-date', t.startDate);
                    taskElement.setAttribute('dueDate', t.dueDate);
                    taskElement.setAttribute('project', t.project);

                    listaTareas.appendChild(taskElement);

                });
        
                const listaProyectos = document.getElementById('proyectos');
                proyectos.forEach(p => {
                    const projectElement = document.createElement('project-card');
                    projectElement.setAttribute('id', p.id);
                    projectElement.setAttribute('active', p.active  );
                    projectElement.setAttribute('name', p.name);
                    projectElement.setAttribute('description', p.description);

                    listaProyectos.appendChild(projectElement);
                });

            
    } catch(error) {
        console.error(error)
    }
    
});