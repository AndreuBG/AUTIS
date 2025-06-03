<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Time Tracking</title>
</head>
<body>
    <h1>Time Tracking</h1>
    <button id="startButton">Iniciar Temporizador</button>
    <button id="stopButton" disabled>Detener Temporizador</button>
    <div id="timerDisplay">0:00</div>

    <script>
        let timer;
        let elapsedTime = 0;

        document.getElementById('startButton').addEventListener('click', startTimer);
        document.getElementById('stopButton').addEventListener('click', stopTimer);

        function startTimer() {
            document.getElementById('startButton').disabled = true;
            document.getElementById('stopButton').disabled = false;

            timer = setInterval(() => {
                elapsedTime++;
                document.getElementById('timerDisplay').innerText = formatTime(elapsedTime);
            }, 1000);

            // Aquí puedes hacer la llamada a la API para crear una nueva entrada de tiempo
            fetch('http://localhost:8080/api/v3/time_entries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer TU_TOKEN_DE_AUTORIZACION' // Asegúrate de incluir tu token
                },
                body: JSON.stringify({
                    // Aquí debes incluir los datos necesarios para la entrada de tiempo
                    "project": "ID_DEL_PROYECTO",
                    "activity": "ID_DE_LA_ACTIVIDAD",
                    "hours": elapsedTime / 3600 // Convertir a horas
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Entrada de tiempo creada:', data);
            })
            .catch(error => {
                console.error('Error al crear la entrada de tiempo:', error);
            });
        }

        function stopTimer() {
            clearInterval(timer);
            document.getElementById('startButton').disabled = false;
            document.getElementById('stopButton').disabled = true;

            // Aquí puedes hacer la llamada a la API para detener la entrada de tiempo
            // Si necesitas actualizar la entrada de tiempo, puedes hacerlo aquí
        }

        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
        }
    </script>
</body>
</html>