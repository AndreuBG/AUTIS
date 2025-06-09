class TaskCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const type = this.getAttribute('type');
        const typeColor = this.getAttribute('typeColor');
        const subject = this.getAttribute('subject');
        const description = this.getAttribute('description') || 'Sin descripción';
        const startDate = this.getAttribute('startDate') || 'No especificada';
        const dueDate = this.getAttribute('dueDate') || 'No especificada';
        const project = this.getAttribute('project');

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                    width: 100%; 
                }
                .card {
                    border: 1px solid #ffbb80;
                    border-radius: 15px;
                    padding: 15px;
                    height: 250px;
                    background-color: #fff8f0;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    user-select: text;
                    position: relative;
                    z-index: 0;
                    overflow: hidden;
                    transition: box-shadow 0.3s, transform 0.3s, border-color 0.3s;
                }
                .card:hover {
                    box-shadow: 0 6px 16px rgba(255,123,0,0.25), 0 2px 4px rgba(0,0,0,0.12);
                    transform: translateY(-4px) scale(1.02);
                    border-color: #ff7b00;
                }
                .trash-icon {
                    position: absolute;
                    right: 10px;  
                    bottom: 10px;
                    width: 25px;
                    height: 25px;
                    opacity: 0;
                    transition: opacity 0.3s;
                    pointer-events: auto;
                    z-index: 10;
                    color: rgba(0,0,0,0.3);
                }
                .card:hover .trash-icon {
                    opacity: 1;
                }
                .card h2 {
                    font-size: 1.3em;
                    margin: 0 0 10px 0;
                    color: #ff7b00;
                    white-space: normal;
                    overflow: visible;
                    text-overflow: unset;
                }
                .card p {
                    font-size: 15px;
                    margin: 4px 0;
                    flex-grow: 1;
                    overflow-wrap: break-word;
                }
                @media (max-width: 600px) {
                    :host {
                        display: block;
                        margin: 0 auto 15px auto;
                    }
                }
            </style>
            <div class="card" tabindex="0" role="region">
                <img class="trash-icon" src="/img/papelera.png" alt="Eliminar tarea" />
                <h2 title="${subject}">${subject}</h2>
                <hr>
                <p><strong>Descripción:</strong> ${description}</p>
                <p><strong>Inicio:</strong> ${startDate}</p>
                <p><strong>Vencimiento:</strong> ${dueDate}</p>
                <p><strong>Proyecto:</strong> ${project}</p>
                <p><strong>Tipo:</strong> <span style="color: ${typeColor}; font-weight: bold;">${type}</span></p>
            </div>
        `;

        const trashIcon = this.shadowRoot.querySelector('.trash-icon');
        if (trashIcon) {
            trashIcon.addEventListener('click', async (e) => {
                e.stopPropagation();
                if (!confirm('¿Seguro que quieres eliminar esta tarea?')) return;
                const taskId = this.getAttribute('id');
                console.log('Eliminando tarea con ID:', taskId);
                try {
                    const res = await fetch(`/tasks/${taskId}`, {
                        method: 'DELETE'
                    });
                    if (res.ok) {
                        this.remove();
                    } else {
                        alert('No se pudo eliminar la tarea');
                    }
                } catch (err) {
                    alert('Error de red al eliminar la tarea');
                }
            });
        }
    }
}

customElements.define('task-card', TaskCard);