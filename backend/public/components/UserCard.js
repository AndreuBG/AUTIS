class UserCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const active = this.getAttribute('active') === 'true';
    this.idUser = this.getAttribute('id'); // asegúrate de que este atributo se pase en HTML
    const name = this.getAttribute('name') || '';
    const login = this.getAttribute('login') || '';
    const email = this.getAttribute('email') || '';

    this.shadowRoot.innerHTML = `
      <style>
        /* Estilos existentes y de modal */
        .card { display: flex; justify-content: space-between; align-items: center; border: 1px solid #ccc; border-radius: 5px; padding: 10px; margin: 10px; background-color: ${active ? '#e0ffe0' : '#dfe9f5'}; }
        .info-container { display: flex; align-items: flex-start; }
        .user-icon { width: 50px; height: 50px; margin-right: 15px; border-radius: 50%; object-fit: cover; }
        .info { display: flex; flex-direction: column; }
        .card h2 { font-size: 1.5em; margin: 0 0 5px 0; }
        .card p { font-size: 1em; margin: 0; }
        .buttons { display: flex; gap: 8px; }
        button { padding: 15px 25px; font-size: 20px; border: none; border-radius: 4px; cursor: pointer; color: white; }
        .boton_modificar { background-color: #4CAF50; }
        .boton_eliminar { background-color: #f44336; }
        .card:hover { background-color: rgb(145, 198, 255); }
        
        /*Modal Formulario */   
            
        .modal {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0,0,0,0.5);
          z-index: 1000;
          justify-content: center;
          align-items: center;
        }        
        .modal-content {
          background-color: white;
          padding: 20px;
          border-radius: 5px;
          width: 600px;
          max-width: 90%;
          border: 2px solid orange; /* borde naranja */
          align-items: center; /* Centra los hijos horizontalmente */
          
        }
        .form-group { 
            margin: 0 auto 20px auto; /* arriba, lados auto, abajo */
            width: 100%;
            max-width: 500px;
            margin-bottom: 15px; 
            text-align: left;
        }
        
        #titulo-mod {
          text-align: center;
          margin-bottom: 20px;
        }
        
        .form-group input,
        .form-group textarea {
          width: 90%;
          margin 0 auto;
          padding: 12px;
          border: 2px solid #002855;
          border-radius: 4px;
          display: block;
        }
        
        .form-group textarea {
          min-height: 200px; /* Más alto */
          resize: vertical;
        }
                
        .form-group label { display: block; margin-bottom: 5px; color: #333; font-size: 18px; }
        .form-group input:invalid,
        .form-group textarea:invalid {
          border-color: #e63946; /* rojo si está vacío o inválido */
        }
        .modal-buttons { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
        #modalbtndel { background-color: #002855; }
        #modalbtnmod { 
          background-color: orange;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;} 
        #modalbtndel:hover,
        #modalbtnmod:hover { background-color: #cc8400; }
      </style>

      <div class="card">
        <div class="info-container">
          <img class="user-icon" src="../img/user.png" alt="User Icon" />
          <div class="info">
            <h2>${name} <i>(${login})</i></h2>
            <p>${email}</p>
          </div>
        </div>
        <div class="buttons">
          <button class="boton_modificar">Modificar</button>
          <button class="boton_eliminar">Eliminar</button>
        </div>
      </div>

      <div class="modal">
        <div class="modal-content">
          <h2 id="titulo-mod">Modificar Usuario</h2>
          <form id="form-modificar">
            <div class="form-group">
              <label>Nombre</label>
              <input type="text" id="firstName" required>
            </div>
            <div class="form-group">
              <label>Apellidos</label>
              <input type="text" id="lastName" required>
            </div>
            <div class="form-group">
              <label>Usuario</label>
              <input type="text" id="login" required>
            </div>
            <div class="form-group">
              <label>Correo electrónico</label>
              <input type="email" id="email" required>
            </div>
            <div class="form-group">
              <label>Descripción</label>
              <textarea id="description" name="description"></textarea>
            </div>
            <div class="modal-buttons">
              <button type="button" class="boton_eliminar" id="modalbtndel">Cancelar</button>
              <button type="submit" class="boton_modificar" id="modalbtnmod">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    `;

    // Eventos
    this.shadowRoot.querySelectorAll('.boton_eliminar')[0].addEventListener('click', () => {
      this.eliminarUsuario(this.idUser);
    });

    const modal = this.shadowRoot.querySelector('.modal');
    const btnModificar = this.shadowRoot.querySelectorAll('.boton_modificar')[0];
    const btnCancelar = modal.querySelector('.boton_eliminar');
    const formModificar = this.shadowRoot.querySelector('#form-modificar');

    btnModificar.addEventListener('click', async () => {
      await this.cargarDatosUsuario();
    });

    btnCancelar.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    formModificar.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.modificarUsuario();
    });
  }

  async cargarDatosUsuario() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token no encontrado. Por favor inicia sesión.');
      return;
    }

    try {
      const API_URL = 'http://localhost:8080';
      const authHeader = 'Basic ' + btoa(`apikey:${token}`);
      const res = await fetch(`${API_URL}/api/v3/users/${this.idUser}`, {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        this.userData = await res.json();
        this.mostrarFormularioModificacion();
      } else {
        const errorText = await res.text();
        alert(`Error al cargar usuario: ${res.status} - ${errorText}`);
        if (res.status === 401) window.location.href = '/login.html';
      }
    } catch (error) {
      console.error('Error de red:', error);
      alert('Error de red al cargar usuario');
    }
  }

  mostrarFormularioModificacion() {
    const form = this.shadowRoot.querySelector('#form-modificar');
    form.querySelector('#firstName').value = this.userData.firstName || '';
    form.querySelector('#lastName').value = this.userData.lastName || '';
    form.querySelector('#login').value = this.userData.login || '';
    form.querySelector('#email').value = this.userData.email || '';
    form.querySelector('#description').value = this.userData.description?.raw || '';
    this.shadowRoot.querySelector('.modal').style.display = 'flex';
  }

  async modificarUsuario() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token no encontrado. Por favor inicia sesión.');
      return;
    }

    const API_URL = 'http://localhost:8080';
    const authHeader = 'Basic ' + btoa(`apikey:${token}`);

      const descripcion = this.shadowRoot.querySelector('#description').value.trim();
      const datosActualizados = {
        firstName: this.shadowRoot.querySelector('#firstName').value,
        lastName: this.shadowRoot.querySelector('#lastName').value,
        login: this.shadowRoot.querySelector('#login').value,
        email: this.shadowRoot.querySelector('#email').value,
        description: descripcion === '' ? 'Sin descripción' : descripcion
      };

      const res = await fetch(`${API_URL}/api/v3/users/${this.idUser}`, {
        method: 'PATCH',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosActualizados)
      });

      if (res.ok) {
        alert('Usuario modificado exitosamente');
        this.shadowRoot.querySelector('.info h2').textContent =
            `${datosActualizados.firstName} ${datosActualizados.lastName}`;
        this.shadowRoot.querySelector('.info p').textContent =
            datosActualizados.description;
        this.setAttribute('description', datosActualizados.description);
        this.shadowRoot.querySelector('.modal').style.display = 'none';
      } else {
        const errorText = await res.text();
        alert(`Error al modificar usuario: ${res.status} - ${errorText}`);
        if (res.status === 401) window.location.href = '/login.html';
      }
    } catch (error) {
      console.error('Error de red:', error);
      alert('Error de red al modificar usuario');
    }


  async eliminarUsuario(id) {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token no encontrado. Por favor inicia sesión.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/v3/users`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        alert('Usuario eliminado');
        this.remove();
      } else {
        const errorText = await res.text();
        alert(`Error al eliminar usuario: ${res.status} - ${errorText}`);
        if (res.status === 401) window.location.href = '/login.html';
      }
    } catch (error) {
      console.error('Error de red:', error);
      alert('Error de red al eliminar usuario');
    }
  }
}

customElements.define('user-card', UserCard);
