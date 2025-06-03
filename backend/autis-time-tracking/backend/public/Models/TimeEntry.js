fetch('http://localhost:8080/api/v3/time_entries', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN' // Reemplaza con tu token de acceso
    }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));