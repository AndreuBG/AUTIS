import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { OpenProjectService } from "./OpenProjectService.js";

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

app.post('/postToken', express.text(), (req, res) => {
    OpenProjectService.setToken(req.body);

});