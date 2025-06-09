export class Graficos {
    static async generarGraficos() {
        try {
            const proyectos = await (await fetch('http://localhost:5500/getProjects')).json();
            const tareas = await (await fetch('http://localhost:5500/getAllTasks')).json();

            this.crearGraficos(proyectos, tareas);
        } catch (error) {
            console.error("Error al generar los gráficos:", error);
        }
    }
    static crearGraficos(proyectos, tareas) {
        const proyectosLabels = proyectos.map(p => p.name);
        const tareasPorProyecto = proyectos.map(p => tareas.filter(t => t.project === p.name).length);

        const ctxBarras = document.getElementById('graficoBarras').getContext('2d');
        new Chart(ctxBarras, {
            type: 'bar',
            data: {
                labels: proyectosLabels,
                datasets: [{
                    label: 'Tareas Por Proyecto',
                    data: tareasPorProyecto,
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
                labels: proyectosLabels,
                datasets: [{
                    label: 'Carga de Trabajo por Proyecto',
                    data: tareasPorProyecto, 
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

        const ctxProyectosEstado = document.getElementById('graficoProyectosEstado');

        if (ctxProyectosEstado) {
            const activos = proyectos.filter(p => p.active === true).length;
            const inactivos = proyectos.filter(p => p.active === false).length;

            new Chart(ctxProyectosEstado, {
                type: 'doughnut',
                data: {
                    labels: ['Activos', 'Inactivos'],
                    datasets: [{
                        data: [activos, inactivos],
                        backgroundColor: ['#2ecc71', '#e74c3c'],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: false,
                    cutout: '70%',
                    layout: {
                        padding: {
                            top: 20,
                            bottom: 10,
                            left: 10,
                            right: 10
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                color: '#09348b',
                                font: {
                                    size: 14,
                                    weight: 'bold'
                                }
                            }
                        }
                    }
                }
            });
        }
    }
}