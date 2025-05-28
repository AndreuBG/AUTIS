class UserCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const active = this.getAttribute('active') === 'true';
    this.idUser = this.getAttribute('id');  // guardamos id para usar en métodos
    const name = this.getAttribute('name');
    const description = this.getAttribute('description');

    this.shadowRoot.innerHTML = `
      <style>
        /* mismo CSS que antes */
        .card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px solid #ccc;
          border-radius: 5px;
          padding: 10px;
          margin: 10px;
          background-color: ${active ? '#e0ffe0' : '#dfe9f5'};
        }
        .info-container {
          display: flex;
          align-items: flex-start;
        }
        .user-icon {
          width: 50px;
          height: 50px;
          margin-right: 15px;
          border-radius: 50%;
          object-fit: cover;
        }
        .info {
          display: flex;
          flex-direction: column;
        }
        .card h2 {
          font-size: 1.5em;
          margin: 0 0 5px 0;
        }
        .card p {
          font-size: 1em;
          margin: 0;
        }
        .buttons {
          display: flex;
          gap: 8px;
        }
        button {
          padding: 15px 25px;      
          font-size: 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          color: white;
        }
        .boton_modificar {
          background-color: #4CAF50;
        }
        .boton_eliminar {
          background-color: #f44336;
        }
        .boton_crear {
          background-color:rgb(93, 92, 85);
        }

        .card:hover {
          background-color: rgb(145, 198, 255);
        }
      </style>

      <div class="card">
        <div class="info-container">
          <img class="user-icon" src="../img/user.png" alt="User Icon" />
          <div class="info">
            <h2>${name}</h2>
            <p>${description}</p>
          </div>
        </div>
        <div class="buttons">
          <button class="boton_modificar">Modificar</button>
          <button class="boton_eliminar">Eliminar</button>
        </div>
      </div>
    `;

    this.shadowRoot.querySelector('.boton_eliminar').addEventListener('click', () => {
      this.eliminarUsuario(this.idUser);
    });
  }

  async eliminarUsuario(id) {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token no encontrado. Por favor inicia sesión.');
      return;
    }

    try {
      const API_URL = 'http://localhost:8080';
      const authHeader = 'Basic ' + btoa(`apikey:${token}`);
      
      console.log('Intentando eliminar usuario:', {
        userId: id,
        authHeader: authHeader,
        status: 'iniciando petición'
      });

      const res = await fetch(`${API_URL}/api/v3/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        console.log('Eliminación exitosa:', {
          userId: id,
          status: res.status
        });
        alert('Usuario eliminado');
        this.remove();
      } else if (res.status === 401) {
        console.error('Error de autorización:', {
          userId: id,
          status: res.status
        });
        alert('Error de autorización. Por favor, vuelva a iniciar sesión.');
        // Opcional: redirigir a la página de login
        window.location.href = '/login.html';
      } else {
        const errorText = await res.text();
        console.error('Error en eliminación:', {
          userId: id,
          status: res.status,
          error: errorText,
          headers: Object.fromEntries(res.headers)
        });
        alert(`Error al eliminar usuario: ${res.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Error de red:', {
        userId: id,
        error: error.message
      });
      alert('Error de red al eliminar usuario');
    }
  }

  async crearUsuario() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token no encontrado. Por favor inicia sesión.');
      return;
    }

    const API_URL = 'http://localhost:8080';
    const authHeader = 'Basic ' + btoa(`apikey:${token}`);

    try {
      const res = await fetch(`${API_URL}/api/v3/users`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'Nuevo Usuario',
          description: 'Descripción del nuevo usuario'
        })
      });

      if (res.ok) {
        alert('Usuario creado exitosamente');
        // Aquí podrías actualizar la lista de usuarios o redirigir
      } else {
        const errorText = await res.text();
        console.error('Error al crear usuario:', errorText);
        alert(`Error al crear usuario: ${res.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Error de red al crear usuario:', error.message);
      alert('Error de red al crear usuario');
    }
  }
}

customElements.define('user-card', UserCard);
