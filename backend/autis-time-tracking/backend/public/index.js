<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Time Tracking</title>
</head>
<body>
    <h1>Time Tracking</h1>
    <button id="startButton">Iniciar</button>
    <button id="stopButton" disabled>Detener</button>
    <div id="timer">00:00:00</div>

    <script>
        let timerInterval;
        let startTime;

        document.getElementById('startButton').addEventListener('click', startTimer);
        document.getElementById('stopButton').addEventListener('click', stopTimer);

        function startTimer() {
            startTime = Date.now();
            timerInterval = setInterval(updateTimer, 1000);
            document.getElementById('startButton').disabled = true;
            document.getElementById('stopButton').disabled = false;
        }

        function stopTimer() {
            clearInterval(timerInterval);
            document.getElementById('startButton').disabled = false;
            document.getElementById('stopButton').disabled = true;

            // Aquí puedes hacer la llamada a la API para registrar el tiempo
            const timeSpent = Math.floor((Date.now() - startTime) / 1000); // Tiempo en segundos
            registerTimeEntry(timeSpent);
        }

        function updateTimer() {
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            const hours = String(Math.floor(elapsedTime / 3600)).padStart(2, '0');
            const minutes = String(Math.floor((elapsedTime % 3600) / 60)).padStart(2, '0');
            const seconds = String(elapsedTime % 60).padStart(2, '0');
            document.getElementById('timer').textContent = `${hours}:${minutes}:${seconds}`;
        }

        async function registerTimeEntry(timeSpent) {
            const response = await fetch('http://localhost:8080/api/v3/time_entries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer YOUR_API_TOKEN' // Reemplaza con tu token de API
                },
                body: JSON.stringify({
                    // Aquí debes incluir los datos necesarios para la entrada de tiempo
                    "time_entry": {
                        "project_id": "YOUR_PROJECT_ID", // Reemplaza con el ID de tu proyecto
                        "hours": timeSpent / 3600, // Convertir a horas
                        "comments": "Registro de tiempo desde la interfaz"
                    }
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Entrada de tiempo registrada:', data);
            } else {
                console.error('Error al registrar la entrada de tiempo:', response.statusText);
            }
        }
    </script>
</body>
</html>