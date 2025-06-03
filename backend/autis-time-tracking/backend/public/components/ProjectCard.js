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
            startTime = new Date();
            timerInterval = setInterval(updateTimer, 1000);
            document.getElementById('startButton').disabled = true;
            document.getElementById('stopButton').disabled = false;

            // Aquí puedes hacer la llamada a la API para crear una nueva entrada de tiempo
            fetch('http://localhost:8080/api/v3/time_entries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Agrega aquí el token de autenticación si es necesario
                },
                body: JSON.stringify({
                    // Aquí van los datos necesarios para crear la entrada de tiempo
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
            clearInterval(timerInterval);
            document.getElementById('startButton').disabled = false;
            document.getElementById('stopButton').disabled = true;

            // Aquí puedes hacer la llamada a la API para detener la entrada de tiempo
            fetch('http://localhost:8080/api/v3/time_entries/{id}', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    // Agrega aquí el token de autenticación si es necesario
                },
                body: JSON.stringify({
                    // Aquí van los datos necesarios para detener la entrada de tiempo
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Entrada de tiempo actualizada:', data);
            })
            .catch(error => {
                console.error('Error al actualizar la entrada de tiempo:', error);
            });
        }

        function updateTimer() {
            const now = new Date();
            const elapsedTime = new Date(now - startTime);
            const hours = String(elapsedTime.getUTCHours()).padStart(2, '0');
            const minutes = String(elapsedTime.getUTCMinutes()).padStart(2, '0');
            const seconds = String(elapsedTime.getUTCSeconds()).padStart(2, '0');
            document.getElementById('timer').textContent = `${hours}:${minutes}:${seconds}`;
        }
    </script>
</body>
</html>