import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { OpenProjectService } from "./OpenProjectService.js";
import {login} from "./controllers/authentication.js";

const app = express();
const PORT = 5500;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'load.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

app.get('/getProjects', async function(req, res) {
    res.send(await OpenProjectService.getAllProjects());
});

app.get('/getTasks', async function(req, res) {
    const pagesize = parseInt(req.query.pageSize) || 16;
    const offset = parseInt(req.query.offset) || 1;

    try {
        const tasks = await OpenProjectService.getAllTasks(pagesize, offset);
        res.send(tasks);
    } catch (error) {
        console.error("Error obteniendo tareas:", error);
        res.status(500).json({ error: 'Error obteniendo tareas' });
    }

});

app.get('/getUsers', async function(req, res) {
    res.send(await OpenProjectService.getAllUsers());
});

app.post('/postToken', express.json(), (req, res) => {
    try {
        const token = req.body.token;
        if (!token) {
            return res.status(400).json({ error: 'Token no proporcionado' });
        }
        OpenProjectService.setToken(token);
        res.status(200).json({ message: 'Token actualizado exitosamente' });
    } catch (error) {
        console.error('Error al procesar el token:', error);
        res.status(500).json({ error: 'Error al actualizar el token' });
    }
});

app.get('/deleteUser/:id', async function (req, res) {
    res.send(await OpenProjectService.deleteUser(req.params.id));
});

app.get('/getOneProject/:id', async function(req, res) {
    try {
        const project = await OpenProjectService.getOneProject(req.params.id);
        res.send(project);
    } catch (error) {
        console.error("Error obteniendo el proyecto:", error);
        res.status(500).json({ error: 'Error obteniendo el proyecto' });
    }
})

app.post('/login', async (req, res) => {
    res.send(await login(req.body));
});

app.post('/createUser', async (req, res) => {
    res.send(await OpenProjectService.createUser(req.body));
})

app.post('/createProject', async (req, res) => {
    res.send(await OpenProjectService.createProject(req.body));
});

app.post('/createTask', async (req, res) => {
    res.send(await OpenProjectService.createTask(req.body));
});

app.get('/getUserData/:id', async function(req, res){
   res.send(await OpenProjectService.getUserData(req.params.id));
});

app.post('/modifyUser/:id', async (req, res) => {
    res.send(await OpenProjectService.modifyUser(req.body, req.params.id));
})

app.get('/getProjectsFiltered/:filter/:orden/:ordenacion', async (req, res) => {
    console.log(req.params.filter);
    res.send(await OpenProjectService.getProjectsFiltered(req.params.filter, req.params.orden, req.params.ordenacion));
});

app.get('/getTasksFiltered/:filter/:orden/:ordenacion', async (req, res) => {
    const pageSize = parseInt(req.query.pageSize) || 16;
    const offset = parseInt(req.query.offset) || 1;
    res.send(await OpenProjectService.getTasksFiltered(req.params.filter, pageSize, offset, req.params.orden, req.params.ordenacion));
});

app.get('/getUsersFiltered/:filter', async (req, res) => {
    console.log(req.params.filter);
    res.send(await OpenProjectService.getUsersFiltered(req.params.filter));
});

// Una sola ruta para getTimeEntries
app.get('/getTimeEntries', async (req, res) => {
    try {
        const entries = await OpenProjectService.getAllTimeEntries();
        const entriesWithUser = await Promise.all(entries.map(async entry => {
            let userInfo = null;
            if (entry._links?.user?.href) {
                const userId = entry._links.user.href.split('/').pop();
                userInfo = await OpenProjectService.getUserData(userId);
            }
            return { ...entry, assignedUser: userInfo };
        }));
        res.json(entriesWithUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/getAllTasks', async function(req, res) {
    try {
        const tasks = await OpenProjectService.getAllTasksNoPagination();
        res.send(tasks);
    } catch (error) {
        console.error("Error obteniendo todas las tareas:", error);
        res.status(500).json({ error: 'Error obteniendo todas las tareas' });
    }
});

app.delete('/projects/:id', async (req, res) => {
    try {
        const result = await OpenProjectService.deleteProject(req.params.id);
        res.status(result.status).send();
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.delete('/tasks/:id', async (req, res) => {
    try {
        const result = await OpenProjectService.deleteTask(req.params.id);
        res.status(result.status).send();
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/getMemberQuantity', async function (req, res){
   res.send(await OpenProjectService.getMemberQuantity());
});

app.post('/addMemberToProject', async (req, res) => {
    res.send(await OpenProjectService.addMemberToProject(req.body.projectId, req.body.numericUserId, req.body.roleId));
})

app.get('/getCurrentMembers/:id', async (req, res) => {
    try {
        const data = await OpenProjectService.getProjectMembers(req.params.id);
        res.json(data);
    } catch (error) {
        console.error("Error obteniendo miembros del proyecto:", error);
        res.status(500).json({ error: 'Error obteniendo miembros del proyecto' });
    }
});

app.delete('/removeMemberFromProject/:memberID', async (req, res) => {
    try {
        const result = await OpenProjectService.removeMemberFromProject(req.params.memberID);
        res.status(result.status).send();
    } catch (error) {
        console.error("Error eliminando miembro del proyecto:", error);
        res.status(500).json({ error: 'Error eliminando miembro del proyecto' });
    }
})