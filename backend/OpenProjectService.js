import { Project } from "./public/Models/Project.js";
import { Task } from "./public/Models/Task.js";
import { User } from "./public/Models/User.js";

export class OpenProjectService {
static API_URL = 'http://localhost:8080/api/v3';
static API_TOKEN;

static setToken(token) {
    this.API_TOKEN = token;
}

static async getAllProjects() {
    const projects = [];

    try {
        const data = await fetch(`${this.API_URL}/projects`, {
            headers: {
                'Authorization': 'Basic ' + btoa(`apikey:${this.API_TOKEN}`)
            }
        })
            .then(response => response.json())
            .then (data => data._embedded.elements)

            for (let i = 0; i < data.length; i++) {
                const project = new Project(data[i].active, data[i].id, data[i].name, data[i].description.raw);
                projects.push(project)
            }


    } catch (error) {
        console.log("Hubo un problema con los proyectos:" + error.message);
        return error;
    }

  return projects;
}
    
 static async getAllTasks() {
    const tasks = [];

    try {
        const data = await fetch(`${this.API_URL}/work_packages?pageSize=100`, {
            headers: {
                'Authorization': 'Basic ' + btoa(`apikey:${this.API_TOKEN}`)
            }
        })
            .then(response => response.json())
            .then(data => data._embedded.elements)

            for (let i = 0; i < data.length; i++) {
                const task = new Task(data[i].id, data[i].subject, data[i].description.raw, data[i].startDate, data[i].dueDate, data[i]._links.project.title);
                tasks.push(task)
            }


    } catch (error) {
        console.error("Hubo un problema con las tareas:" + error.message);
    }

    return tasks;
}

    static async getAllUsers() {
        const data = await fetch(`${this.API_URL}/users`, {
        headers: {
            'Authorization': 'Basic ' + btoa(`apikey:${this.API_TOKEN}`)
        }
    })
    .then(response => response.json())
    .then(data => data._embedded.elements)

    const users = [];

    for (let i = 0; i < data.length; i++) {
    const user = new User(data[i].active, data[i].id, data[i].name, data[i].login, data[i].email);
    users.push(user);
}
return users;
}

    static async deleteUser(id) {
        try {
            const authHeader = 'Basic ' + btoa(`apikey:${this.API_TOKEN}`);

            console.log('Intentando eliminar usuario:', {
                userId: id,
                authHeader: authHeader,
                status: 'iniciando petición'
            });

            const res = await fetch(`${this.API_URL}/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json'
                }
            });


            if (res.ok) {
                console.log('Eliminación exitosa:', {
                    userId: id,
                    status: res.status
                });

            } else {
                console.log(res);
            }
            return res;

        } catch (error) {
            console.error('Error de red:', {
                userId: id,
                error: error.message
            });
            throw error;
        }

    }

    static async createUser(userData) {
        console.log(userData);
        try {
            console.log(this.API_TOKEN);
            const response = await fetch(`${this.API_URL}/users`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + btoa(`apikey:${this.API_TOKEN}`),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            console.log(response);

        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión al servidor');
        }
    }

    static async getUserData(id) {
    try {
        const response = await fetch(`${this.API_URL}/users/${id}`, {
            headers: {
                'Authorization': 'Basic ' + btoa(`apikey:${this.API_TOKEN}`)
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener datos del usuario');
        }

        const userData = await response.json();
        return userData;

    } catch (error) {
        console.error(`Error consiguiendo datos del usuario ${id}:`, error.message);
        throw error;
    }
}
    static async modifyUser(datosActualizados, idUser) {
    try {

        const response = await fetch(`${this.API_URL}/users/${idUser}`, {
            method: 'PATCH',
            headers: {
                'Authorization': 'Basic ' + btoa(`apikey:${this.API_TOKEN}`),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosActualizados)
        });

        if (!response.ok) {
            console.log(response);
            console.error("Error modificando el usuario");
        }
    } catch (error) {
        console.error('Error de red:', error);
    }
    }

    static async getProjectsFiltered(filters) {
        const projects = [];
        const encodedFilters = encodeURIComponent(filters);

        console.log(`${this.API_URL}/projects?filters=${encodedFilters}`);

        try {
            const data = await fetch(`${this.API_URL}/projects?filters=${encodedFilters}`, {
                headers: {
                    'Authorization': 'Basic ' + btoa(`apikey:${this.API_TOKEN}`)
                }
            })
                .then(response => response.json())
                .then (data => data._embedded.elements)

            for (let i = 0; i < data.length; i++) {
                const project = new Project(data[i].active, data[i].id, data[i].name, data[i].description.raw);
                projects.push(project)
            }


        } catch (error) {
            console.log("Hubo un problema con los proyectos:" + error.message);
            return error;
        }

        return projects;
    }

    static async getAllTimeEntries() {
        try {
            const response = await fetch(`${this.API_URL}/time_entries`, {
                headers: {
                    'Authorization': 'Basic ' + btoa(`apikey:${this.API_TOKEN}`)
                }
            });
            const data = await response.json();
            return data._embedded ? data._embedded.elements : [];
        } catch (error) {
            console.error("Error obteniendo time entries:", error);
            return [];
        }
    }

}
