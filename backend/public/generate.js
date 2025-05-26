import './components/ProjectCard.js';
import './components/TaskCard.js';
import './components/TabButton.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const responseProject = await fetch('/getProjects');

            const proyectos = await responseProject.json();

            console.log(proyectos);


            const listaProyectos = document.getElementById('proyectos');
            proyectos.forEach(p => {
                const projectElement = document.createElement('project-card');
                projectElement.setAttribute('id', p.id);
                projectElement.setAttribute('active', p.active  );
                projectElement.setAttribute('name', p.name);
                projectElement.setAttribute('description', p.description);

                listaProyectos.appendChild(projectElement);
            });




        const responseTask = await fetch('/getTasks');

        if (!responseTask.ok) {
            console.error("Error a la hora de conseguir las tareas")
        } else {
            const tareas = await responseTask.json();

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
        }

    } catch(error) {
        console.error(error)
    }
    
});