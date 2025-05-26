class UserCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {

        const active = this.getAttribute('active') === 'true';
        const id = this.getAttribute('id');
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
    }
}
customElements.define('user-card', UserCard);