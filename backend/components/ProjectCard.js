class ProjectCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
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
                    width: 200px;
                    background-color: ${active ? '#e0ffe0' : '#fff'};
                }
                .card h2 {
                    font-size: 1.5em;
                    margin: 0;
                }
                .card p {
                    font-size: 1em;
                    margin: 5px 0;
                }
                .card button {
                    background-color: #007bff;
                    color: white;
                    border: none;
                    padding: 10px;
                    border-radius: 5px;
                    cursor: pointer;
                }
                .card button:hover {
                    background-color: #0056b3;
                }
            </style>
            <div class="card">
                <h2>${name}</h2>
                <p>${description}</p>
                <button id="viewButton">View</button>
            </div>
        `;

    }

}

customElements.define('project-card', ProjectCard);