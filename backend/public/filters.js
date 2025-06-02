document.addEventListener('DOMContentLoaded', async () => {
   const botonProyectos = document.getElementById('aplicar-filtro');
   const estadoProyecto = document.getElementById('filtro-estado')
   botonProyectos.addEventListener('click', async () => {
        const estado = estadoProyecto.value;
        let filtros = [];

        if (estado === "active") {
            filtros.push({"active": {"operator": "=", "values": ["t"]}});
        } else if (estado === "inactive") {
            filtros.push({"active": {"operator": "=", "values": ["f"]}});
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