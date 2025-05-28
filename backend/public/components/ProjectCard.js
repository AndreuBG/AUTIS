class ProjectCard extends HTMLElement {
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
                border: 1px solid #ccc;
                border-radius: 5px;
                padding: 10px;
                margin: 10px;
                width: 100%;
                background-color: #ececec;
                
            }
            .card h2 {
                font-size: 1.5em;
                margin: 0;
            }
            .card p {
                font-size: 1em;
                margin: 5px 0;
            }
            
            .card b {
                color: ${active ? '#029302' : '#c60009'};
            }

            .card:hover {
                background-color:rgb(249,252,255);
            }
            </style>
            <div class="card">
            <h2>${name}</h2>
            <hr>
            <p>Estado: <b>${active ? "Activo" : "Inactivo"}</b></p><br>
            <p>${description}</p>
            </div>
        `;

    }

}

customElements.define('project-card', ProjectCard);