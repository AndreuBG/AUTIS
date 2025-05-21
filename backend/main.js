import { OpenProjectService } from "./OpenProjectService.js";
import './components/ProjectCard.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const proyectos = await OpenProjectService.getAllProjects();
        const tareas = await OpenProjectService.getAllTasks();

        const listaTareas = document.getElementById('tareas');
                listaTareas.insertAdjacentHTML('beforeend', '<ul>');
                tareas.forEach(tarea => {
                    listaTareas.insertAdjacentHTML('beforeend', '<li> ' + tarea.subject + ' - ' + tarea.description + '</li>');
                });
                listaTareas.insertAdjacentHTML('beforeend', '</ul>');
        
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