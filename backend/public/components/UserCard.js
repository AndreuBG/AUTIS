class UserCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.timer = 0;       // segundos transcurridos
        this.intervalId = null;
        this.isRunning = false;
    }

    connectedCallback() {
        const active = this.getAttribute('active') === 'true';
        this.id = this.getAttribute('id');  // importante para localStorage
        const name = this.getAttribute('name');
        const description = this.getAttribute('description');

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
                    background-color: ${active ? '#e0ffe0' : '#dfe9f5'};
                    font-family: Arial, sans-serif;
                }
                .info-container {
                    display: flex;
                    align-items: center;
                }
                .user-icon {
                    width: 50px;
                    height: 50px;
                    margin-right: 10px;
                    border-radius: 50%;
                    object-fit: cover;
                }
                .info h2 {
                    margin: 0 0 5px 0;
                    font-size: 1.2em;
                }
                .info p {
                    margin: 2px 0;
                    font-size: 0.9em;
                    color: #333;
                }
                .buttons {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    justify-content: flex-start;
                }
                .buttons button {
                    flex: 1 1 auto;
                    min-width: 90px;
                    padding: 6px 12px;
                    font-size: 0.9em;
                    border-radius: 4px;
                    border: none;
                    cursor: pointer;
                    transition: background-color 0.3s ease, color 0.3s ease;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                #toggleTimer {
                    background-color: #007bff;
                    color: white;
                }
                #toggleTimer:hover {
                    background-color: #0056b3;
                }
                .boton_modificar {
                    background-color: #28a745;
                    color: white;
                }
                .boton_modificar:hover {
                    background-color: #1e7e34;
                }
                .boton_eliminar {
                    background-color: #dc3545;
                    color: white;
                }
                .boton_eliminar:hover {
                    background-color: #a71d2a;
                }
            </style>

            <div class="card">
                <div class="info-container">
                    <img class="user-icon" src="../img/user.png" alt="User Icon" />
                    <div class="info">
                        <h2>${name}</h2>
                        <p>${description}</p>
                        <p>Tiempo conectado: <span id="timer">0m 0s</span></p>
                    </div>
                </div>
                <div class="buttons">
                    <button id="toggleTimer">Iniciar</button>
                    <button class="boton_modificar">Modificar</button>
                    <button class="boton_eliminar">Eliminar</button>
                </div>
            </div>
        `;

        this.loadState();

        this.shadowRoot.getElementById('toggleTimer').addEventListener('click', () => {
            if (this.isRunning) {
                this.pauseTimer();
            } else {
                this.startTimer();
            }
        });
    }

    disconnectedCallback() {
        this.pauseTimer();
        this.saveState();
    }

    startTimer() {
        if (!this.isRunning) {
            this.intervalId = setInterval(() => {
                this.timer++;
                this.updateDisplay();
                this.saveState();
            }, 1000);
            this.isRunning = true;
            this.shadowRoot.getElementById('toggleTimer').textContent = 'Detener';
        }
    }

    pauseTimer() {
        if (this.isRunning) {
            clearInterval(this.intervalId);
            this.isRunning = false;
            this.shadowRoot.getElementById('toggleTimer').textContent = 'Iniciar';
            this.saveState();
        }
    }

    updateDisplay() {
        this.shadowRoot.getElementById('timer').textContent = this.formatTime(this.timer);
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    }

    saveState() {
        const state = {
            timer: this.timer,
            isRunning: this.isRunning
        };
        localStorage.setItem(`userTimer_${this.id}`, JSON.stringify(state));
    }

    loadState() {
        const saved = localStorage.getItem(`userTimer_${this.id}`);
        if (saved) {
            const state = JSON.parse(saved);
            this.timer = state.timer || 0;
            this.isRunning = state.isRunning || false;
        }
        this.updateDisplay();

        // Si estaba corriendo antes, dejamos detenido para que no arranque solo:
        if (this.isRunning) {
            this.isRunning = false;
            this.shadowRoot.getElementById('toggleTimer').textContent = 'Iniciar';
        }
    }
}

customElements.define('user-card', UserCard);