class TaskCard extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const id = this.getAttribute('id');
        const subject = this.getAttribute('subject');
        const description = this.getAttribute('description');
        const startDate = this.getAttribute('startDate');
        const dueDate = this.getAttribute('dueDate');
        const project = this.getAttribute('project');

        this.shadowRoot.innerHTML = `
            <style>
                .card {
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    padding: 10px;
                    margin: 10px;
                    width: 200px;
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
                <h2>${subject}</h2>
                <p>${description}</p>
                <p>Start Date: ${startDate}</p>
                <p>Due Date: ${dueDate}</p>
                <p>Project: ${project}</p>
                <button id="viewButton">View</button>
            </div>
        `;
    }

}

customElements.define('task-card', TaskCard);