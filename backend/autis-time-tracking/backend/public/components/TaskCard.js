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

            // Aquí puedes hacer la petición para iniciar el time entry
            fetch('http://localhost:8080/api/v3/time_entries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Agrega aquí el token de autenticación si es necesario
                },
                body: JSON.stringify({
                    // Aquí van los datos necesarios para crear un time entry
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Time entry started:', data);
            })
            .catch(error => console.error('Error:', error));
        }

        function stopTimer() {
            clearInterval(timerInterval);
            document.getElementById('startButton').disabled = false;
            document.getElementById('stopButton').disabled = true;

            // Aquí puedes hacer la petición para detener el time entry
            fetch('http://localhost:8080/api/v3/time_entries', {
                method: 'PATCH', // O el método que corresponda para detener el time entry
                headers: {
                    'Content-Type': 'application/json',
                    // Agrega aquí el token de autenticación si es necesario
                },
                body: JSON.stringify({
                    // Aquí van los datos necesarios para actualizar el time entry
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Time entry stopped:', data);
            })
            .catch(error => console.error('Error:', error));
        }

        function updateTimer() {
            const elapsedTime = Date.now() - startTime;
            const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
            const seconds = Math.floor((elapsedTime / 1000) % 60);
            document.getElementById('timer').innerText = 
                `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
    </script>
</body>
</html>