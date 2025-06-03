// Función para obtener las entradas de tiempo
async function getTimeEntries() {
    try {
        const response = await fetch('http://localhost:8080/api/v3/time_entries', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Agrega aquí cualquier otro encabezado necesario, como la autenticación
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data); // Maneja los datos como necesites
    } catch (error) {
        console.error('Error fetching time entries:', error);
    }
}

// Llama a la función para obtener las entradas de tiempo
getTimeEntries();