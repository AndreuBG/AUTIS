export class OpenProjectService {
static API_URL = 'http://localhost:8080/api/v3';

static async getAllProjects() {
  const data = await fetch(`${this.API_URL}/projects`, {
                headers: {
                'Authorization': 'Basic ' + btoa('apikey:e89578ec5a8405ffc4349e4f50333485e9e525193a297bd19cd1435099691cdb')
                }
            })
            .then(response => response.json())
            .then(data => data._embedded.elements)

            return data;
}
    
 static async getAllTasks() {
    const data = await fetch(`${this.API_URL}/work_packages`, {
                headers: {
                'Authorization': 'Basic ' + btoa('apikey:e89578ec5a8405ffc4349e4f50333485e9e525193a297bd19cd1435099691cdb')
                }
            })
            .then(response => response.json())
            .then(data => data._embedded.elements)

            return data;
}
}

