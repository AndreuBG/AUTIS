import { Project } from "./Models/Project.js";
import { Task } from "./Models/Task.js";

export class OpenProjectService {
static API_URL = 'http://localhost:8080/api/v3';

static async getAllProjects() {
  const data = await fetch(`${this.API_URL}/projects`, {
                headers: {
                'Authorization': 'Basic ' + btoa('apikey:83382842c354f6095df2a29715b78f3b5302ab7d586b65deaf1e08a69296fe52')
                }
            })
            .then(response => response.json())
            .then(data => data._embedded.elements)

  const projects = [];

  for (let i = 0; i < data.length; i++) {
      const project = new Project(data[i].active, data[i].id, data[i].name, data[i].description.raw);
      projects.push(project)
  }
  console.log(projects);
  return projects;
}
    
 static async getAllTasks() {
    const data = await fetch(`${this.API_URL}/work_packages`, {
                headers: {
                'Authorization': 'Basic ' + btoa('apikey:83382842c354f6095df2a29715b78f3b5302ab7d586b65deaf1e08a69296fe52')
                }
            })
            .then(response => response.json())
            .then(data => data._embedded.elements)

    const tasks = [];

    for (let i = 0; i < data.length; i++) {
    const task = new Task(data[i].id, data[i].subject, data[i].description.raw, data[i].startDate, data[i].dueDate, data[i]._links.project.title);
    tasks.push(task)
    }
            
    console.log(tasks);

    return tasks;
}
}

