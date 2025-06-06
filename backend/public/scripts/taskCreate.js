document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal-crear-tarea');
  const openBtn = document.getElementById('boton-crear-tarea');
  const cancelBtn = document.getElementById('cancelar-crear-tarea');
  const form = document.getElementById('form-crear-tarea');
  const projectSelect = document.getElementById('project-crear');

  // Populate project dropdown
  async function populateProjects() {
    try {
      const res = await fetch('http://localhost:5500/getProjects', {
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const projects = await res.json();
        projects.forEach(project => {
          const option = document.createElement('option');
          option.value = project.id;
          option.textContent = project.name;
          projectSelect.appendChild(option);
        });
      } else {
        console.error('Error fetching projects:', await res.text());
      }
    } catch (error) {
      console.error('Error fetching projects:', error.message);
    }
  }

// Initialize dropdowns
populateProjects();
projectSelect.addEventListener('change', () => {
});

// Open modal
openBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
});

// Close modal and reset form
cancelBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    form.reset();
});

// Submit form
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log("xxx")

    const taskData = {
        "subject": document.getElementById('subject-crear').value,
        "description": {"raw": `${document.getElementById('description-crear').value || null}`},
        "startDate": document.getElementById('start-date-crear').value || null,
        "dueDate": document.getElementById('due-date-crear').value || null,
        "_links": {
            "project": {"href": `/api/v3/projects/${projectSelect.value}`},
            "type": {"href": `/api/v3/types/${document.getElementById('type-crear').value}`},
            "status": {"href": "/api/v3/statuses/1"},
            "priority": {"href": `/api/v3/priorities/${document.getElementById('priority-crear').value}`}
        }
    };




    // Validate dates
    if (taskData.startDate && taskData.dueDate && taskData.startDate > taskData.dueDate) {
        alert('La fecha de inicio no puede ser posterior a la fecha de vencimiento');
        return;
    }

    try {
        const res = await fetch('http://localhost:5500/createTask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData),
        });

        if (res.ok) {
            alert('Tarea creada exitosamente');
            modal.style.display = 'none';
            form.reset();
            location.reload();
        } else {
            const data = await res.json();
            alert(`Error: ${data.message || 'No se pudo crear la tarea'}`);
        }
    } catch (error) {
        alert('Error de conexión al servidor');
        console.error('Error creando tarea:', error.message);
    }
});
});