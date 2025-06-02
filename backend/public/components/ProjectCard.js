class ProjectCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.expanded = false;
        this.onExternalExpand = this.onExternalExpand.bind(this);
    }

    connectedCallback() {
        this.render();
        document.addEventListener('project-expanded', this.onExternalExpand);
    }

    disconnectedCallback() {
        document.removeEventListener('project-expanded', this.onExternalExpand);
    }

    onExternalExpand(event) {
        if (event.detail === null) {
            this.shadowRoot.querySelector('.card').classList.remove('hidden');
        } else if (event.detail !== this) {
            this.shadowRoot.querySelector('.card').classList.add('hidden');
            if (this.expanded) {
                this.expanded = false;
                document.body.classList.remove('no-scroll');
                this.render();
            }
        } else {
            this.shadowRoot.querySelector('.card').classList.remove('hidden');
        }
    }

    toggleDescription() {
        this.expanded = !this.expanded;

        if (this.expanded) {
            document.body.classList.add('no-scroll');
            document.dispatchEvent(new CustomEvent('project-expanded', {
                detail: this,
                bubbles: true,
                composed: true
            }));
        } else {
            document.body.classList.remove('no-scroll');
            document.dispatchEvent(new CustomEvent('project-expanded', {
                detail: null,
                bubbles: true,
                composed: true
            }));
        }
        this.render();
    }

    getRelatedTasksHtml(projectName) {
        const tasks = Array.from(document.querySelectorAll('task-card'));
        return tasks
            .filter(task => task.getAttribute('project') === projectName)
            .map(task => task.outerHTML)
            .join('');
    }

    render() {
        const active = this.getAttribute('active') === 'true';
        const name = this.getAttribute('name');
        const fullDescription = this.getAttribute('description') || '';

        const maxLength = 100;
        const shortDescription = fullDescription.length > maxLength
            ? fullDescription.slice(0, maxLength) + '...'
            : fullDescription;

        const descriptionToShow = this.expanded ? fullDescription : shortDescription;
        const descriptionClass = this.expanded ? 'descripcion expanded' : 'descripcion collapsed';
        const cardClass = this.expanded ? 'card expanded' : 'card collapsed';

        const relatedTasksHtml = this.expanded
            ? `<div class="related-tasks">${this.getRelatedTasksHtml(name)}</div>`
            : '';

        this.shadowRoot.innerHTML = `
            <style>
            .related-tasks {
                display: flex;
                flex-wrap: wrap;
                gap: 20px;
                margin-top: 20px;
            }

            .related-tasks task-card {
                flex: 1 1 calc(50% - 20px); 
                max-width: calc(50% - 20px);
            }
    
            
            body.no-scroll {
                overflow: hidden;
            }

            :host {
                display: block;
                position: relative;
                z-index: 0;
            }

            .card {
        
                border: 1px solid #ccc;
                border-radius: 5px;
                padding: 15px;
                margin: 10px auto;
                width: 300px;
                background-color: #ececec;
                box-sizing: border-box;
                font-family: Arial, sans-serif;
                transition: 
                transform 0.3s ease,
                width 0.3s ease,
                height 0.3s ease,
                background-color 0.3s ease,
                box-shadow 0.3s ease,
                opacity 0.3s ease;
                cursor: pointer;
                overflow: hidden;
                position: relative;
                z-index: 0;
                user-select: none;
            }

            .card.hidden {
                opacity: 0;
                pointer-events: none;
                transform: scale(0.95);
                transition: opacity 0.3s ease, transform 0.3s ease;
            }

            .card:hover:not(.expanded):not(.hidden) {
                transform: scale(1.05);
                box-shadow: 0 8px 20px rgba(0,0,0,0.2);
                z-index: 1;
            }

            .card.collapsed {
                height: 200px;
                width: 300px;
                overflow: hidden;
            }

            .card.expanded {
                position: fixed;
                top: 100px;
                left: 50%;
                transform: translateX(-50%);
                width: 70vw;
                background-color: white;
                box-shadow: 0 0 30px rgba(0,0,0,0.5);
                border-radius: 10px;
                overflow-y: auto;
                max-height: 80vh;
                z-index: 9999;
                transform: scale(1) translateX(-50%);
                cursor: default;
                user-select: text;
                padding-bottom: 50px;
            }

            task-card {
                display: block;
                margin-bottom: 20px;
            }

            .card h2 {
                font-size: 1.5em;
                margin: 0;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .estado {
                font-size: 1em;
                margin: 10px 0;
            }

            .descripcion {
                font-size: 1em;
                margin: 10px 0;
                white-space: normal;
                flex-grow: 1;
                overflow-wrap: break-word;
            }

            .descripcion.collapsed {
                max-height: 100px;
                overflow-y: auto;
            }

            .descripcion.expanded {
                max-height: none;
            }

            .card b {
                color: ${active ? '#029302' : '#c60009'};
            }

            .toggle-arrow {
                position: absolute;
                right: 15px;
                bottom: 15px;
                font-size: 1.8em;
                color: rgba(0,0,0,0.3);
                user-select: none;
                pointer-events: none;
                transition: color 0.3s ease;
            }
            .card.collapsed:hover .toggle-arrow {
                color: rgba(0,0,0,0.6);
            }

            .close-btn {
                position: absolute;
                top: 10px;
                right: 10px;
                font-size: 1.5em;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 3px;
                width: 28px;
                height: 28px;
                line-height: 28px;
                text-align: center;
                font-weight: bold;
                color: rgba(0, 0, 0, 0.5);
                cursor: pointer;
                user-select: none;
                transition: 
                    background-color 0.2s ease, 
                    color 0.2s ease,
                    box-shadow 0.2s ease;
                box-shadow: none;
                z-index: 10000;
            }
            .close-btn:hover {
                background: rgba(255, 255, 255, 0.8);
                color: #c60009;
                box-shadow: 0 0 5px rgba(198, 0, 9, 0.6);
            }
            </style>

            <div class="${cardClass}" tabindex="0" role="button" aria-expanded="${this.expanded}">
                <h2 title="${name}">${name}</h2>
                <hr>
                <p class="estado">Estado: <b>${active ? "Activo" : "Inactivo"}</b></p>
                <p class="${descriptionClass}" title="${fullDescription}">
                    <div class="descripcion-inner">${descriptionToShow}</div>
                </p>

                ${!this.expanded && fullDescription.length > maxLength
            ? `<span class="toggle-arrow" aria-hidden="true">▼</span>`
            : ''}

                ${this.expanded
            ? `<span class="close-btn" role="button" aria-label="Cerrar descripción">×</span>`
            : ''}

                ${relatedTasksHtml}
            </div>
        `;

        const cardEl = this.shadowRoot.querySelector('.card');
        cardEl.addEventListener('click', () => {
            if (!this.expanded) this.toggleDescription();
        });

        const closeBtn = this.shadowRoot.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDescription();
            });
        }
    }
}

customElements.define('project-card', ProjectCard);