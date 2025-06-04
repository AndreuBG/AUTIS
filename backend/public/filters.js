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

       const listaUsuarios = document.getElementById('users');
       listaUsuarios.innerHTML = '';
       usuariosFiltradas.forEach(u => {
           const userElement = document.createElement('user-card');
           userElement.setAttribute('id', u.id);
           userElement.setAttribute('active', u.active  );
           userElement.setAttribute('name', u.name);
           userElement.setAttribute('login', u.login);
           userElement.setAttribute('email', u.email);

           listaUsuarios.appendChild(userElement);
       });

   });

   botonTareas.addEventListener('click', async () => {
       const tipo = document.getElementById('filtro-tipo-tareas').value;
       const estado = document.getElementById('filtro-estado-tareas').value;
       const prioridad = document.getElementById('filtro-Prioridad-tareas').value;
       let paginaTareaActual = 1;
       const pageSize = 16;

       let filtros = [];
       if (tipo !== "") filtros.push({"type_id": {"operator": "=", "values" : [`${tipo}`]}});
       if (prioridad !== "") filtros.push({"priority": {"operator": "=", "values" : [`${prioridad}`]}});

       const filtrosTXT = JSON.stringify(filtros);

       async function cargarTareasFiltradas(pagina) {
           try {
               const response = await fetch(`/getTasksFiltered/${filtrosTXT}?pageSize=${pageSize}&offset=${pagina}`);
               const tareasFiltradas = await response.json();

               const listaTareas = document.getElementById('tareas');
               listaTareas.innerHTML = '';

               if (tareasFiltradas.length === 0 && pagina > 1) {
                   await cargarTareasFiltradas(pagina - 1);
                   return;
               }

               tareasFiltradas.forEach(t => {
                   const taskElement = document.createElement('task-card');
                   Object.entries({
                       id: t.id,
                       subject: t.subject,
                       description: t.description,
                       startDate: t.startDate,
                       dueDate: t.dueDate,
                       project: t.project,
                       type: t.type
                   }).forEach(([key, value]) => taskElement.setAttribute(key, value || ''));

                   listaTareas.appendChild(taskElement);
               });

               document.getElementById('pagina-actual').textContent = `Página ${pagina}`;
               paginaTareaActual = pagina;

               document.getElementById('anterior').disabled = pagina <= 1;
               document.getElementById('siguiente').disabled = tareasFiltradas.length < pageSize;
           } catch (error) {
               console.error("Error cargando tareas filtradas:", error.message);
           }
       }

       // Iniciar con la primera página
       await cargarTareasFiltradas(1);

       // Configurar eventos de paginación
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