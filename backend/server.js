import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { OpenProjectService } from "./OpenProjectService.js";
import {login} from "./controllers/authentication.js";

// Inicialització d'Express
const app = express();
const PORT = 5500;

// Configuració de __dirname en mòduls ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

// Càrrega de middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servim els arxius estàtics de /public
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'load.html'));
});

// Escoltem el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

app.get('/getProjects', async function(req, res) {
    res.send(await OpenProjectService.getAllProjects());
});

app.get('/getTasks', async function(req, res) {
    res.send(await OpenProjectService.getAllTasks());
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


app.post('/login', async (req, res) => {
    res.send(await login(req.body));
});

app.post('/createUser', async (req, res) => {
    res.send(await OpenProjectService.createUser(req.body));
})

app.get('/getUserData/:id', async function(req, res){
   res.send(await OpenProjectService.getUserData(req.params.id));
});

app.post('/modifyUser/:id', async (req, res) => {
    res.send(await OpenProjectService.modifyUser(req.body, req.params.id));
})

app.get('/getProjectsFiltered/:filter', async (req, res) => {
    console.log(req.params.filter);
    res.send(await OpenProjectService.getProjectsFiltered(req.params.filter));
});

app.get('/getTasksFiltered/:filter', async (req, res) => {
    console.log(req.params.filter);
    res.send(await OpenProjectService.getTasksFiltered(req.params.filter));
});

app.get('/getUsersFiltered/:filter', async (req, res) => {
    console.log(req.params.filter);
    res.send(await OpenProjectService.getUsersFiltered(req.params.filter));
});

app.get('/getTimeEntries', async (req, res) => {
    try {
        const entries = await OpenProjectService.getAllTimeEntries();

        // Obtener detalles de usuario para cada time entry
        const entriesWithUser = await Promise.all(entries.map(async entry => {
            let userInfo = null;
            if (entry._links && entry._links.user && entry._links.user.href) {
                // Extrae el ID del usuario desde la URL
                const userId = entry._links.user.href.split('/').pop();
                userInfo = await OpenProjectService.getUserData(userId);
            }
            return {
                ...entry,
                assignedUser: userInfo // Incluye los datos del usuario asignado
            };
        }));

        res.json(entriesWithUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
