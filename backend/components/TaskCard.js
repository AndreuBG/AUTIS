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
                    display: inline-block;
                    border: 1px solid #ffbb80;
                    border-radius: 15px;
                    padding: 15px;
                    margin: 10px;
                    width: calc(33.33% - 40px);
                    min-width: 250px;
                    background-color: #fff8f0;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .card h2 {
                    font-size: 1.5em;
                    margin: 0;
                    color: #ff7b00;
                }
                .card p {
                    font-size: 1em;
                    margin: 5px 0;
                }
                .card:hover {
                    background-color: #ffddb3;
                    transform: translateY(-2px);
                    transition: all 0.3s ease;
                }
                button {
                    background-color: #ff9040;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 8px;
                    cursor: pointer;
                }
                button:hover {
                    background-color: #ff7020;
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