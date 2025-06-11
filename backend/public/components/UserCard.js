class UserCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.userData = null;
  }

  connectedCallback() {
    const active = this.getAttribute('active') === 'true';
    this.idUser = this.getAttribute('id'); // asegúrate de que este atributo se pase en HTML
    const name = this.getAttribute('name') || '';
    const login = this.getAttribute('login') || '';
    const email = this.getAttribute('email') || '';
    const status = this.getAttribute('status') || '';

    this.shadowRoot.innerHTML = `
      <style>
        .card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px solid #ccc;
          border-radius: 5px;
          padding: 10px;
          margin: 10px;
          background-color: #f3f3f3;
          transition: background-color 0.3s, box-shadow 0.3s, transform 0.3s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .card:hover {
          background-color:rgb(219, 219, 219); /* Gris claro para el hover */
          box-shadow: 0 8px 20px rgba(0,0,0,0.12);
          transform: scale(1.01);
          transition: background-color 0.3s, box-shadow 0.3s, transform 0.3s;
        }
        .info-container { display: flex; align-items: flex-start; }
        .user-icon { width: 50px; height: 50px; margin-right: 15px; border-radius: 50%; object-fit: cover; }
        .info { display: flex; flex-direction: column; }
        .card h2 { font-size: 1.3em; margin: 0 0 5px 0; font-weight: bold; }
        .card p { font-size: 1em; margin: 0; }
        .buttons {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
          flex-wrap: wrap;
          max-width: 100%;
        }
        button {
          padding: 10px 10px;
          font-size: 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          color: white;
          min-width: 90px;
          max-width: 100%;
          box-sizing: border-box;
          transition: background 0.2s, color 0.2s, font-size 0.2s, padding 0.2s;
        }

        @media (max-width: 600px) {
          .buttons {
            gap: 4px;
            justify-content: flex-end;
            flex-wrap: nowrap;
            max-width: 100%;
          }
          button {
            font-size: 12px;
            padding: 6px 8px;
            min-width: 50px;
            max-width: 100px;
            white-space: nowrap;
          }
        }

        .boton_modificar { background-color: #4CAF50; }
        .boton_eliminar { background-color: #f44336; } 
            
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
          min-height: 200px; 
          resize: vertical;
        }
                
        .form-group label { display: block; margin-bottom: 5px; color: #333; font-size: 18px; }
        .form-group input:invalid,
        .form-group textarea:invalid {
          border-color: #e63946;
        }
        .modal-buttons { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
        #modalbtndel { background-color: #002855; }
        #modalbtnmod { 
          background-color: orange;
          color: white;
          padding: 8px 10px;
          border: none;
          border-radius: 4px;
          cursor: pointer;} 
        #modalbtndel:hover,
        #modalbtnmod:hover { background-color: #cc8400; }

       /* Estilos para el contenedor del formulario */
        .form-group {
          display: flex;
          flex-direction: column;
          margin-bottom: 1rem; /* Espacio entre contenedores */
        }

        /* Estilos para el selector de estado */
        .form-group select {
          width: 100%; /* Asegura que tome el ancho del contenedor padre */
          max-width: 100%; /* Evita que se desborde */
          box-sizing: border-box; /* Incluye padding y border en el ancho total */
          margin: 0; /* Elimina márgenes adicionales */
          padding: 10px; /* Ajusta el padding para que coincida con otros inputs */
          border: 2px solid #002855;
          border-radius: 4px;
          background-color: white;
          font-size: 16px;
          color: #333;
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 10px center;
          background-size: 1em;
        }

        /* Estilo para otros inputs (para consistencia) */
        .form-group input,
        .form-group textarea {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          margin: 0;
          padding: 10px; /* Mismo padding que el select */
          border: 2px solid #002855;
          border-radius: 4px;
          font-size: 16px;
          color: #333;
        }

        .form-group select:hover,
        .form-group input:hover,
        .form-group textarea:hover {
          border-color: #0a28d1;
        }

        .form-group select:focus,
        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #0a28d1;
          box-shadow: 0 0 0 2px rgba(10, 40, 209, 0.2);
        }

        .form-group select option {
          padding: 10px;
          background-color: white;
          color: #333;
        }

        /* Media query para responsividad */
        @media (max-width: 600px) {
          .form-group select,
          .form-group input,
          .form-group textarea {
            font-size: 14px;
            padding: 8px; /* Ajuste de padding para pantallas pequeñas */
          }
        }
      </style>

      <div class="card">
        <div class="info-container">
          <img class="user-icon" src="../img/user.png" alt="User Icon" />
          <div class="info">
            <h2>${name} <i>(${login})</i></h2>
            <p>${email}  [<b style="color: blue;">${status}</b>]</p>
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
              <input type="text" id="firstName" required
                oninvalid="this.setCustomValidity('Por favor, introduce un nombre')"
                oninput="this.setCustomValidity('')">
            </div>
            <div class="form-group">
              <label>Apellidos</label>
              <input type="text" id="lastName" required
                oninvalid="this.setCustomValidity('Por favor, introduce los apellidos')"
                oninput="this.setCustomValidity('')">
            </div>
            <div class="form-group">
              <label>Usuario</label>
              <input type="text" id="login" required
                oninvalid="this.setCustomValidity('Por favor, introduce un nombre de usuario')"
                oninput="this.setCustomValidity('')">
            </div>
            <div class="form-group">
              <label>Correo electrónico</label>
              <input type="email" 
                id="email" 
                required
                pattern="^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                oninvalid="this.setCustomValidity('Por favor, introduce un correo electrónico válido con formato usuario@dominio.extension')"
                oninput="validateEmail(this)">
            </div>
            <div class="form-group">
              <label>Estado</label>
              <select id="status" required
                oninvalid="this.setCustomValidity('Por favor, selecciona un estado')"
                oninput="this.setCustomValidity('')">
                <option value="active">Activo</option>
                <option value="locked">Bloqueado</option>
                <option value="registered">Registrado</option>
                <option value="invited">Invitado</option>
              </select>
            </div>
            <div class="modal-buttons">
              <button type="button" class="boton_eliminar" id="modalbtndel">Cancelar</button>
              <button type="submit" class="boton_modificar" id="modalbtnmod">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    `;

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

    const validateEmail = (input) => {
      const email = input.value;
      // Verificar si hay @ y si después hay al menos un punto
      const parts = email.split('@');
      if (parts.length !== 2 || !parts[1].includes('.')) {
        input.setCustomValidity('El correo debe tener un dominio válido después del @ (ejemplo@dominio.com)');
        return false;
      }
      // Verificar el formato completo
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(email)) {
        input.setCustomValidity('Por favor, introduce un correo electrónico válido con formato usuario@dominio.extension');
        return false;
      }
      input.setCustomValidity('');
      return true;
    };

    // Añadir función de validación al contexto del shadow DOM
    this.shadowRoot.validateEmail = validateEmail;
  }

  async cargarDatosUsuario() {
    try {
        const res = await fetch(`http://localhost:5500/getUserData/${this.idUser}`);
        
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
    console.log(this.userData);
    const form = this.shadowRoot.querySelector('#form-modificar');
    form.querySelector('#firstName').value = this.userData.firstName || '';
    form.querySelector('#lastName').value = this.userData.lastName || '';
    form.querySelector('#login').value = this.userData.login || '';
    form.querySelector('#email').value = this.userData.email || '';
    form.querySelector('#status').value = this.userData.status || 'active';
    this.shadowRoot.querySelector('.modal').style.display = 'flex';
  }

  async modificarUsuario() {
    const emailInput = this.shadowRoot.querySelector('#email');
    if (!this.shadowRoot.validateEmail(emailInput)) {
      emailInput.focus();
      return;
    }
    
    const datosActualizados = {
      firstName: this.shadowRoot.querySelector('#firstName').value,
      lastName: this.shadowRoot.querySelector('#lastName').value,
      login: this.shadowRoot.querySelector('#login').value,
      email: this.shadowRoot.querySelector('#email').value,
      status: this.shadowRoot.querySelector('#status').value
    };

    try {
      const res = await fetch(`http://localhost:5500/modifyUser/${this.idUser}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosActualizados)
      });

      if (res.ok) {
        alert('Usuario modificado exitosamente');
        this.shadowRoot.querySelector('.info h2').textContent =
            `${datosActualizados.firstName} ${datosActualizados.lastName} (${datosActualizados.login})`;
        this.shadowRoot.querySelector('.info p').innerHTML =
            `${datosActualizados.email}  [<b style="color: blue;">${datosActualizados.status}</b>]`;
        this.setAttribute('status', datosActualizados.status);
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
  }

  async eliminarUsuario(id) {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

    try {
      const res = await fetch(`http://localhost:5500/deleteUser/${id}`);

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