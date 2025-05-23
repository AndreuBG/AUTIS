import { Project } from "./public/Models/Project.js";
import { Task } from "./public/Models/Task.js";
import {response} from "express";

export class OpenProjectService {
static API_URL = 'http://localhost:8080/api/v3';
static API_TOKEN;

static setToken(token) {
    this.API_TOKEN = token;
}

static async getAllProjects() {
  const data = await fetch(`${this.API_URL}/projects`, {
                headers: {
                'Authorization': 'Basic ' + btoa(`apikey:${this.API_TOKEN}`)
                }
            })
            .then(response => response.json())
            .then (data => data._embedded.elements)
            .catch(function (error) {
                console.log("Hubo un problema con los proyectos:" + error.message);
            });



  const projects = [];

  for (let i = 0; i < data.length; i++) {
      const project = new Project(data[i].active, data[i].id, data[i].name, data[i].description.raw);
      projects.push(project)
  }
  return projects;
}
    
 static async getAllTasks() {
    const data = await fetch(`${this.API_URL}/work_packages`, {
                headers: {
                'Authorization': 'Basic ' + btoa(`apikey:${this.API_TOKEN}`)
                }
            })
            .then(response => response.json())
            .then(data => data._embedded.elements)
            .catch(function (error) {
                console.log("Hubo un problema con las tareas:" + error.message);
            });

    const tasks = [];

    for (let i = 0; i < data.length; i++) {
    const task = new Task(data[i].id, data[i].subject, data[i].description.raw, data[i].startDate, data[i].dueDate, data[i]._links.project.title);
    tasks.push(task)
    }


    return tasks;
}
}

