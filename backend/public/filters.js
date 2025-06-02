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
        const filtrosURL = encodeURIComponent(filtrosTXT);

        console.log(filtrosURL);
        const response = await fetch(`/getProjectsFiltered/${filtrosURL}`)
        console.log(response)
        const proyectosFiltrados = await response.json();
        console.log(proyectosFiltrados);
   })
});