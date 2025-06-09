class ProjectCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.expanded = false;
        this.onExternalExpand = this.onExternalExpand.bind(this);
        this.availableUsers = [];
        this.projectMembers = new Set();
    }

    connectedCallback() {
        this.render();
        document.addEventListener('project-expanded', this.onExternalExpand);
    }

    disconnectedCallback() {
        document.removeEventListener('project-expanded', this.onExternalExpand);
    }

    onExternalExpand(event) {
        const card = this.shadowRoot.querySelector('.card');
        if (event.detail === null) {
            // Cuando se cierra cualquier tarjeta, todas vuelven a ser visibles
            card.classList.remove('hidden');
            card.style.zIndex = '0';
        } else if (event.detail !== this) {
            // Cuando se expande otra tarjeta, esta se oculta
            card.classList.add('hidden');
            card.style.zIndex = '0';
            if (this.expanded) {
                this.expanded = false;
                document.body.classList.remove('no-scroll');
                this.render();
            }
        } else {
            // Cuando esta tarjeta se expande
            card.classList.remove('hidden');
            card.style.zIndex = '9999';
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

    async fetchAvailableUsers() {
        try {
            const response = await fetch('/getUsers');
            const users = await response.json();
            this.availableUsers = users.filter(user => !this.projectMembers.has(user.id));
            return this.availableUsers;
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    }

    async addMember(userId, roleId = 3) {
        try {
            const projectId = this.getAttribute('id');
            console.log('Adding member with:', {
                projectId,
                userId,
                roleId,
                token: localStorage.getItem('token')
            });

            // Ensure userId is a number
            const numericUserId = parseInt(userId, 10);
            if (isNaN(numericUserId)) {
                throw new Error('Invalid user ID format');
            }

            const response = await fetch('http://localhost:8080/api/v3/memberships', {
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + btoa(`apikey:${localStorage.getItem('token')}`),
                    'Content-Type': 'application/json',
                    'Accept': 'application/hal+json'
                },
                body: JSON.stringify({
                    _type: "Membership",
                    project: {
                        href: `/api/v3/projects/${projectId}`
                    },
                    principal: {
                        href: `/api/v3/users/${numericUserId}`
                    },
                    roles: [
                        {
                            href: `/api/v3/roles/${roleId}`
                        }
                    ]
                })
            });

            // Log the actual request
            console.log('Request sent:', {
                url: 'http://localhost:8080/api/v3/memberships',
                body: JSON.stringify({
                    _type: "Membership",
                    project: { href: `/api/v3/projects/${projectId}` },
                    principal: { href: `/api/v3/users/${numericUserId}` },
                    roles: [{ href: `/api/v3/roles/${roleId}` }]
                }, null, 2)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Full error response:', errorData);
                throw new Error(`Failed to add member: ${response.status}\nMessage: ${errorData.message}\nDetails: ${JSON.stringify(errorData._embedded?.details || {})}`);
            }

            const data = await response.json();
            this.projectMembers.add(userId);
            const currentMembers = parseInt(this.getAttribute('members') || '0');
            this.setAttribute('members', currentMembers + 1);
            this.render();
            return data;
        } catch (error) {
            console.error('Error adding member:', error);
            throw error;
        }
    }

    async showMembersModal() {
        const users = await this.fetchAvailableUsers();
        const modal = document.createElement('div');
        modal.className = 'members-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Añadir Miembros</h3>
                <div class="users-list">
                    ${users.map(user => `
                        <div class="user-item" data-user-id="${user.id}">
                            <span>${user.name}</span>
                            <button class="add-user-btn">Añadir</button>
                        </div>
                    `).join('')}
                </div>
                <button class="close-modal-btn">Cerrar</button>
            </div>
        `;

        this.shadowRoot.appendChild(modal);

        modal.querySelector('.close-modal-btn').addEventListener('click', () => {
            modal.remove();
        });

        modal.querySelectorAll('.add-user-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const userId = e.target.closest('.user-item').dataset.userId;
                await this.addMember(userId);
                e.target.closest('.user-item').remove();
            });
        });
    }

    getRelatedTasksHtml(projectName) {
        // Usar las tareas globales almacenadas en window.todasLasTareas
        return window.todasLasTareas
            .filter(task => task.project === projectName)
            .map(task => {
                const taskElement = document.createElement('task-card');
                taskElement.setAttribute('id', task.id);
                taskElement.setAttribute('type', task.type);
                taskElement.setAttribute('subject', task.subject);
                taskElement.setAttribute('description', task.description);
                taskElement.setAttribute('startDate', task.startDate);
                taskElement.setAttribute('dueDate', task.dueDate);
                taskElement.setAttribute('project', task.project);
                return taskElement.outerHTML;
            })
            .join('');
    }

    render() {
        const active = this.getAttribute('active') === 'true';
        const name = this.getAttribute('name');
        const fullDescription = this.getAttribute('description') || '';
        const members = this.getAttribute('members') || '0';

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
                cursor: pointer;
                overflow: hidden;
                position: relative;
                z-index: 0;
                user-select: none;
            }

            .card.hidden {
                display: none;
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
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 70vw;
                height: auto;
                max-height: 80vh;
                background-color: white;
                box-shadow: 0 0 30px rgba(0,0,0,0.5);
                border-radius: 10px;
                overflow-y: auto;
                z-index: 9999;
                padding: 20px;
            }

            .overlay {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                z-index: 9998;
            }

            .card.expanded + .overlay {
                display: block;
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

            .member-count {
                color: #666;
                font-size: 0.9em;
                margin-top: 8px;
                display: flex;
                align-items: center;
                gap: 4px;
            }
            .member-count span {
                color: #0a28d1;
                font-weight: bold;
            }

            .members-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10001;
            }

            .modal-content {
                background: white;
                padding: 20px;
                border-radius: 8px;
                width: 80%;
                max-width: 500px;
                max-height: 80vh;
                overflow-y: auto;
            }

            .users-list {
                margin: 20px 0;
            }

            .user-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px;
                border-bottom: 1px solid #eee;
            }

            .add-user-btn {
                padding: 5px 10px;
                background: #0a28d1;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }

            .add-user-btn:hover {
                background: #081d94;
            }

            .add-members-btn {
                margin-top: 10px;
                padding: 8px 16px;
                background: #0a28d1;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }

            .add-members-btn:hover {
                background: #081d94;
            }

            .close-modal-btn {
                margin-top: 10px;
                padding: 8px 16px;
                background: #666;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
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

                <div class="member-count">
                    👥 Miembros: <span>${members}</span>
                </div>

                ${this.expanded ? `
                    <button class="add-members-btn">Añadir Miembros</button>
                ` : ''}
            </div>
            ${this.expanded ? '<div class="overlay"></div>' : ''}
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

        if (this.expanded) {
            this.shadowRoot.querySelector('.add-members-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.showMembersModal();
            });
        }
    }
}

customElements.define('project-card', ProjectCard);