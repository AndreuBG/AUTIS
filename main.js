import { OpenProjectService } from "./OpenProjectService.js";

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const proyectos = await OpenProjectService.getAllProjects();
        const tareas = await OpenProjectService.getAllTasks();

        const listaTareas = document.getElementById('tareas');
                listaTareas.insertAdjacentHTML('beforeend', '<ul>');
                tareas.forEach(tarea => {
                    listaTareas.insertAdjacentHTML('beforeend', '<li> ' + tarea.subject + ' - ' + tarea.description.raw + '</li>');
                });
                listaTareas.insertAdjacentHTML('beforeend', '</ul>');
        
                const listaProyectos = document.getElementById('proyectos');
                listaProyectos.insertAdjacentHTML('beforeend', '<ul>');
                proyectos.forEach(proyecto => {
                    listaProyectos.insertAdjacentHTML('beforeend', '<li> ' + proyecto.name + ' - ' + proyecto.description.raw + '</li>');
                });
                listaProyectos.insertAdjacentHTML('beforeend', '</ul>');

            
    } catch(error) {
        console.error(error)
    }
    
});