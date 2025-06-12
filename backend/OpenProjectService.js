import { Project } from "./public/Models/Project.js";
import { Task } from "./public/Models/Task.js";
import { User } from "./public/Models/User.js";

export class OpenProjectService {
    static API_URL = 'http://localhost:8080/api/v3';
    static API_TOKEN;
    static encodedSort = encodeURIComponent(JSON.stringify([["createdAt", "desc"]]));

    static setToken(token) {
        this.API_TOKEN = token;
    }

    static async getAllProjects() {
        const projects = [];

        try {
            const data = await fetch(`${this.API_URL}/projects?sortBy=${this.encodedSort}`, {
                headers: {
                    'Authorization': 'Basic ' + btoa(`apikey:${this.API_TOKEN}`)
                }
            })
                .then(response => response.json())
                .then(data => data._embedded.elements)

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

    static async getAllTasks(pageSize = 16, offset = 1) {
        const tasks = [];
        try {
            // Calculamos el offset correcto (página 1 = offset 0, página 2 = offset 16, etc.)
            const apiOffset = offset;



            const data = await fetch(`${this.API_URL}/work_packages?sortBy=${this.encodedSort}&pageSize=${pageSize}&offset=${apiOffset}`, {
                headers: {
                    'Authorization': 'Basic ' + btoa(`apikey:${this.API_TOKEN}`)
                }
            })
                .then(response => response.json())
                .then(data => data._embedded.elements);

            for (let i = 0; i < data.length; i++) {
                const task = new Task(
                    data[i].id,
                    data[i].subject,
                    data[i].description.raw,
                    data[i].startDate,
                    data[i].dueDate,
                    data[i]._links.project.title,
                    data[i]._links.type.title,
                    data[i]._links.priority.title
                );
                tasks.push(task);
            }
        } catch (error) {
            console.error("Hubo un problema con las tareas:", error.message);
        }
        return tasks;
    }

    static async getAllTasksNoPagination() {
        const tasks = [];
        try {
            const data = await fetch(`${this.API_URL}/work_packages?pageSize=1000`, {
                headers: {
                    'Authorization': 'Basic ' + btoa(`apikey:${this.API_TOKEN}`)
                }
            })
                .then(response => response.json())
                .then(data => data._embedded.elements);

            for (let i = 0; i < data.length; i++) {
                const task = new Task(
                    data[i].id,
                    data[i].subject,
                    data[i].description.raw,
                    data[i].startDate,
                    data[i].dueDate,
                    data[i]._links.project.title,
                    data[i]._links.type.title,
                    data[i]._links.priority.title
                );
                tasks.push(task);
            }
        } catch (error) {
            console.error("Hubo un problema con las tareas:", error.message);
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
    const user = new User(data[i].active, data[i].id, data[i].name, data[i].login, data[i].email, data[i].status);
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
                body: JSON.stringify({
                    ...userData,
                    status: userData.status || 'active' // Ensure status is set
                })
            });

            console.log(response);

        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión al servidor');
        }
    }

    static async createProject(projectData) {
        console.log(projectData);
        try {
            const response = await fetch(`${this.API_URL}/projects`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + btoa(`apikey:${this.API_TOKEN}`),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(projectData)
            });

            console.log(response);

        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión al servidor');
        }
    }

    static async createTask(taskData) {
        console.log(taskData);
        try {
            const response = await fetch(`${this.API_URL}/work_packages`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + btoa(`apikey:${this.API_TOKEN}`),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData)
            });

            console.log(response);

        } catch (error) {
            console.error('Error:', error);
            throw error;
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

    static async getProjectsFiltered(filters, orden, ordenacion) {
        const projects = [];
        const encodedFilters = encodeURIComponent(filters);
        const encodedSort = encodeURIComponent(JSON.stringify([[orden, ordenacion]]));

        try {
            const data = await fetch(`${this.API_URL}/projects?sortBy=${encodedSort}&filters=${encodedFilters}`, {
                headers: {
                    'Authorization': 'Basic ' + btoa(`apikey:${this.API_TOKEN}`)
                }
            })
                .then(response => response.json())
                .then(data => data._embedded.elements)

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

    static async getTasksFiltered(filters, pageSize = 16, offset = 1, orden, ordenacion) {
        const tasks = [];
        const encodedFilters = encodeURIComponent(filters);
        const encodedSort = encodeURIComponent(JSON.stringify([[orden, ordenacion]]));

        try {
            // Usar el offset directamente como está, ya que viene correctamente desde el cliente
            const url = `${this.API_URL}/work_packages?sortBy=${encodedSort}&pageSize=${pageSize}&offset=${offset}&filters=${encodedFilters}`;
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': 'Basic ' + btoa(`apikey:${this.API_TOKEN}`)
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const elements = data._embedded?.elements || [];

            for (const element of elements) {
                const task = new Task(
                    element.id,
                    element.subject,
                    element.description?.raw,
                    element.startDate,
                    element.dueDate,
                    element._links.project?.title,
                    element._links.type?.title,
                    element._links.priority?.title
                );
                tasks.push(task);
            }
            
            return tasks;

        } catch (error) {
            console.error("Error con las tareas filtradas:", error.message);
            return [];
        }
    }

    static async getUsersFiltered(filters) {
        const users = [];
        const encodedFilters = encodeURIComponent(filters);

        try {
            const data = await fetch(`${this.API_URL}/users?filters=${encodedFilters}`, {
                headers: {
                    'Authorization': 'Basic ' + btoa(`apikey:${this.API_TOKEN}`)
                }
            })
                .then(response => response.json())
                .then(data => data._embedded.elements)

            for (let i = 0; i < data.length; i++) {
                const user = new User(data[i].active, data[i].id, data[i].name, data[i].login, data[i].email, data[i].status);
                users.push(user);
            }
        } catch (error) {
            console.log("Hubo un problema con los usuarios filtrados:" + error.message);
            return error;
        }

        return users;
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

    static async getOneProject(id) {
        try {
            const response = await fetch(`${this.API_URL}/projects/${id}`, {
                headers: {
                    'Authorization': 'Basic ' + btoa(`apikey:${this.API_TOKEN}`)
                }
            });
            if (!response.ok) {
                throw new Error('Error al obtener el proyecto');
            }
            const projectData = await response.json();
            return new Project(projectData.active, projectData.id, projectData.name, projectData.description.raw);

        } catch (error) {
            console.error("Error obteniendo el proyecto:", error);
            throw error;
        }
    }

    static async deleteProject(id) {
    try {
        const res = await fetch(`${this.API_URL}/projects/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Basic ' + btoa(`apikey:${this.API_TOKEN}`)
            }
        });
        return res;
    } catch (error) {
        console.error('Error eliminando proyecto:', error.message);
        throw error;
    }
}

    static async deleteTask(id) {
        try {
            const res = await fetch(`${this.API_URL}/work_packages/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Basic ' + btoa(`apikey:${this.API_TOKEN}`)
                }
            });
            return res;
        } catch (error) {
            console.error('Error eliminando tarea:', error.message);
            throw error;
        }
    }

    static async getMemberQuantity() {

        // Obtener memberships con autenticación
        const responseMemberships = await fetch('http://localhost:8080/api/v3/memberships', {
            headers: {
                'Authorization': 'Basic ' + btoa(`apikey:${this.API_TOKEN}`),
            }
        });

        if (!responseMemberships.ok) {
            throw new Error(`Error al obtener memberships: ${responseMemberships.status}`);
        }

        const membershipsData = await responseMemberships.json();

        // Validar y contar miembros por proyecto
        const miembrosPorProyecto = {};
        if (membershipsData._embedded && membershipsData._embedded.elements) {
            membershipsData._embedded.elements.forEach(membership => {
                if (membership._links && membership._links.project) {
                    const projectId = membership._links.project.href.split('/').pop();
                    miembrosPorProyecto[projectId] = (miembrosPorProyecto[projectId] || 0) + 1;
                }
            });
        }

        return miembrosPorProyecto;
    }

    static async addMemberToProject(projectId, numericUserId, roleId) {
        return await fetch('http://localhost:8080/api/v3/memberships', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + btoa(`apikey:${this.API_TOKEN}`),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                project: { href: `/api/v3/projects/${projectId}` },
                principal: { href: `/api/v3/users/${numericUserId}` },
                roles: [{ href: `/api/v3/roles/${roleId}` }]
            })
        });
    }

    static async getProjectMembers(projectId) {
        const response = await fetch(`${this.API_URL}/memberships?filters=[{"project_id":{"operator":"=","values":["${projectId}"]}}]`, {
            headers: {
                'Authorization': 'Basic ' + btoa(`apikey:${this.API_TOKEN}`),
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }
        return await response.json();
    }

    static async removeMemberFromProject(membershipId) {
        return await fetch(`${this.API_URL}/memberships/${membershipId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Basic ' + btoa(`apikey:${this.API_TOKEN}`)
            }
        });
    }
}