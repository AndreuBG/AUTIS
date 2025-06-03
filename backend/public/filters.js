document.addEventListener('DOMContentLoaded', async () => {
   const botonProyectos = document.getElementById('aplicar-filtro-proyectos');

   const botonTareas = document.getElementById('aplicar-filtro-tareas');

   const botonUsuarios = document.getElementById('aplicar-filtro-usuarios');

   botonUsuarios.addEventListener('click', async () => {
      const estado = document.getElementById("filtro-estado-usuarios").value;

      let filtros = [];

      if (estado !== "") filtros.push({"status": {"operator": "=", "values" : [`${estado}`]}});

       const filtrosTXT = JSON.stringify(filtros);

       const response = await fetch(`/getUsersFiltered/${filtrosTXT}`)
       const usuariosFiltradas = await response.json();

       console.log(usuariosFiltradas);

   });

   botonTareas.addEventListener('click', async () => {
       const tipo = document.getElementById('filtro-tipo-tareas').value;
       const estado = document.getElementById('filtro-estado-tareas').value;
       const prioridad = document.getElementById('filtro-Prioridad-tareas').value;

       let filtros = [];

       if (tipo !== "") filtros.push({"type_id": {"operator": "=", "values" : [`${tipo}`]}});

       console.log(prioridad);
       if (prioridad !== "") filtros.push({"priority": {"operator": "=", "values" : [`${prioridad}`]}});

       const filtrosTXT = JSON.stringify(filtros);

       const response = await fetch(`/getTasksFiltered/${filtrosTXT}`)
       const tareasFiltradas = await response.json();

       const listaTareas = document.getElementById('tareas');
       listaTareas.innerHTML = '';
       tareasFiltradas.forEach(t => {
           const taskElement = document.createElement('task-card');
           taskElement.setAttribute('id', t.id);
           taskElement.setAttribute('subject', t.subject);
           taskElement.setAttribute('description', t.description);
           taskElement.setAttribute('startDate', t.startDate);
           taskElement.setAttribute('dueDate', t.dueDate);
           taskElement.setAttribute('project', t.project);

           listaTareas.appendChild(taskElement);
       });


   });

   botonProyectos.addEventListener('click', async () => {
        const activo = document.getElementById('filtro-actividad-proyectos').value;
        let filtros = [];

        if (activo !== "") {
            filtros.push({"active": {"operator": "=", "values": [`${activo}`]}});
        }


        const filtrosTXT = JSON.stringify(filtros);

        const response = await fetch(`/getProjectsFiltered/${filtrosTXT}`)
        const proyectosFiltrados = await response.json();

        const listaProyectos = document.getElementById('proyectos');
        listaProyectos.innerHTML = "";
       proyectosFiltrados.forEach(p => {
           const projectElement = document.createElement('project-card');
           projectElement.setAttribute('id', p.id);
           projectElement.setAttribute('active', p.active  );
           projectElement.setAttribute('name', p.name);
           projectElement.setAttribute('description', p.description);

           listaProyectos.appendChild(projectElement);
       });
   })
});