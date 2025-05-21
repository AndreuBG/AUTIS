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

            return data;
}
    
 static async getAllTasks() {
    const data = await fetch(`${this.API_URL}/work_packages`, {
                headers: {
                'Authorization': 'Basic ' + btoa('apikey:83382842c354f6095df2a29715b78f3b5302ab7d586b65deaf1e08a69296fe52')
                }
            })
            .then(response => response.json())
            .then(data => data._embedded.elements)

            return data;
}
}

