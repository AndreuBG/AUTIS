document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal-crear-tarea');
  const openBtn = document.getElementById('boton-crear-tarea');
  const cancelBtn = document.getElementById('cancelar-crear-tarea');
  const form = document.getElementById('form-crear-tarea');
  const projectSelect = document.getElementById('project-crear');

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

  populateProjects();
  projectSelect.addEventListener('change', () => {
  });

  openBtn.addEventListener('click', () => {
      modal.style.display = 'flex';
  });

  cancelBtn.addEventListener('click', () => {
      modal.style.display = 'none';
      form.reset();
  });

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

  let isLoading = false;
  let currentRequest = null;
  let currentPage = 1;

  async function cargarTareas(page, filters = {}) {
      if (isLoading) {
          return;
      }

      // Cancelar petición anterior si existe
      if (currentRequest) {
          currentRequest.abort();
      }

      isLoading = true;
      const paginaActualBtn = document.getElementById('pagina-actual');
      
      try {
          const controller = new AbortController();
          currentRequest = controller;

          // Construir URL con filtros
          const queryParams = new URLSearchParams({
              page: page,
              ...filters
          });

          const response = await fetch(`http://localhost:5500/tasks?${queryParams}`, {
              signal: controller.signal
          });

          if (!response.ok) throw new Error('Error al cargar tareas');
          
          const data = await response.json();
          
          // Actualizar solo si es la petición más reciente
          if (currentRequest === controller) {
              actualizarTareas(data.tasks);
              currentPage = page;
              paginaActualBtn.textContent = page;
          }
      } catch (error) {
          if (error.name !== 'AbortError') {
              console.error('Error cargando tareas:', error);
          }
      } finally {
          isLoading = false;
      }
  }

  // Debounce para los botones de paginación
  function debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
          const later = () => {
              clearTimeout(timeout);
              func(...args);
          };
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
      };
  }

  // Eventos de paginación con debounce
  document.getElementById('anterior').addEventListener('click', 
      debounce(() => {
          if (!isLoading && currentPage > 1) {
              cargarTareas(currentPage - 1);
          }
      }, 300)
  );

  document.getElementById('siguiente').addEventListener('click',
      debounce(() => {
          if (!isLoading) {
              cargarTareas(currentPage + 1);
          }
      }, 300)
  );

  // Aplicar filtros con estado de carga
  document.getElementById('aplicar-filtro-tareas').addEventListener('click', () => {
      if (!isLoading) {
          currentPage = 1;
          const filters = obtenerFiltros(); // función que obtiene los valores de los filtros
          cargarTareas(1, filters);
      }
  });
});