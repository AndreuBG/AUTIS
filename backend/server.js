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
    res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'));
});

// Escoltem el servidor
app.listen(PORT, () => {
    console.log(`Servidor escoltant a http://localhost:${PORT}`);
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


app.post('/login', async (req, res) => {
    res.send(await login(req.body));
});